import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import AjvPkg from "ajv";

const Ajv = AjvPkg as unknown as typeof AjvPkg;

export interface AdmissionResult {
  admitted: boolean;
  reasons: string[];
  evidencePath: string;
}

export function runAdmission(root: string): AdmissionResult {
  const reasons: string[] = [];
  const resolvedRoot = resolve(root);

  // Required files
  const requiredFiles = [".gitignore", "README.md", "LICENSE"];
  for (const file of requiredFiles) {
    try {
      readFileSync(resolve(resolvedRoot, file));
    } catch {
      reasons.push(`REQUIRED_FILE_MISSING: ${file}`);
    }
  }

  // Optional policy validation
  try {
    const policyPath = resolve(resolvedRoot, "wfsl.admission.json");
    const raw = readFileSync(policyPath, "utf-8");
    const policy = JSON.parse(raw);

    const ajv = new (Ajv as any)({ allErrors: true, strict: true });
    const validate = ajv.compile({
      type: "object",
      required: ["version"],
      properties: {
        version: { type: "string" }
      },
      additionalProperties: true
    });

    if (!validate(policy)) {
      reasons.push("POLICY_INVALID");
    }
  } catch {
    // policy optional
  }

  const admitted = reasons.length === 0;

  // Evidence emission
  const evidenceDir = resolve(resolvedRoot, "evidence");
  mkdirSync(evidenceDir, { recursive: true });

  const evidencePath = resolve(
    evidenceDir,
    `admission-${new Date().toISOString().replace(/[:.]/g, "-")}.json`
  );

  writeFileSync(
    evidencePath,
    JSON.stringify(
      {
        admitted,
        reasons,
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
  );

  return { admitted, reasons, evidencePath };
}
