import Ajv from "ajv";
import { WFSL_ADMISSION_SCHEMA_V1 } from "./schema.v1.js";
import type {
  WFSLAdmissionManifestV1,
  WFSLDecisionInput,
  WFSLDecisionResult,
  WFSLDecisionEvidence,
  WFSLSurface,
  WFSLDecisionCode
} from "./types.js";

const ajv = new Ajv({ allErrors: true, strict: true });
const validateManifest = ajv.compile(WFSL_ADMISSION_SCHEMA_V1);

function nowIso(now: Date): string {
  return now.toISOString();
}

function normalisePath(p: string): string {
  if (!p) return "/";
  return p.startsWith("/") ? p : `/${p}`;
}

function methodUpper(m?: string): string | undefined {
  if (!m) return undefined;
  return m.toUpperCase();
}

function isExpired(surface: WFSLSurface, now: Date): boolean {
  if (!surface.expires_at) return false;
  const t = Date.parse(surface.expires_at);
  if (Number.isNaN(t)) return false;
  return t < now.getTime();
}

function buildEvidence(
  manifest: Partial<WFSLAdmissionManifestV1> | undefined,
  input: WFSLDecisionInput,
  outcome: "ADMITTED" | "REFUSED" | "ERROR",
  code: WFSLDecisionCode,
  status: number,
  now: Date
): WFSLDecisionEvidence {
  return {
    schema: "wfsl.admission.v1",
    manifest_version: manifest?.manifest_version,
    manifest_id: manifest?.integrity?.manifest_id,
    issuer: manifest?.integrity?.issuer,
    route: normalisePath(input.pathname),
    method: methodUpper(input.method),
    outcome,
    code,
    status,
    posture: "deny",
    timestamp: nowIso(now)
  };
}

export function parseManifestJson(jsonText: string): WFSLAdmissionManifestV1 | null {
  try {
    return JSON.parse(jsonText) as WFSLAdmissionManifestV1;
  } catch {
    return null;
  }
}

export function decideAdmission(
  manifest: unknown,
  input: WFSLDecisionInput
): WFSLDecisionResult {
  const now = input.now ?? new Date();
  const pathname = normalisePath(input.pathname);
  const method = methodUpper(input.method) ?? "GET";

  const ok = validateManifest(manifest);
  if (!ok) {
    const evidence = buildEvidence(
      undefined,
      { pathname, method, now },
      "ERROR",
      "ADMISSION_MANIFEST_INVALID",
      500,
      now
    );

    return {
      ok: false,
      outcome: "ERROR",
      status: 500,
      evidence,
      errors: validateManifest.errors
    };
  }

  const typed = manifest as WFSLAdmissionManifestV1;
  const surfaces = typed.surfaces ?? [];

  const surface = surfaces.find((s) => normalisePath(s.path) === pathname);

  if (!surface) {
    const status = typed.defaults?.refusal_status ?? 451;
    const evidence = buildEvidence(
      typed,
      { pathname, method, now },
      "REFUSED",
      "SURFACE_NOT_ADMITTED",
      status,
      now
    );

    return { ok: true, outcome: "REFUSED", status, evidence };
  }

  if (isExpired(surface, now)) {
    const status = typed.defaults?.refusal_status ?? 451;
    const evidence = buildEvidence(
      typed,
      { pathname, method, now },
      "REFUSED",
      "SURFACE_EXPIRED",
      status,
      now
    );

    return { ok: true, outcome: "REFUSED", status, evidence };
  }

  if (surface.kind === "api") {
    const methods = (surface.methods ?? ["GET"]).map((m) => m.toUpperCase());
    if (!methods.includes(method)) {
      const status = typed.defaults?.refusal_status ?? 451;
      const evidence = buildEvidence(
        typed,
        { pathname, method, now },
        "REFUSED",
        "METHOD_NOT_ADMITTED",
        status,
        now
      );

      return { ok: true, outcome: "REFUSED", status, evidence };
    }
  }

  const evidence = buildEvidence(
    typed,
    { pathname, method, now },
    "ADMITTED",
    "ADMITTED",
    200,
    now
  );

  return { ok: true, outcome: "ADMITTED", status: 200, evidence, surface };
}
