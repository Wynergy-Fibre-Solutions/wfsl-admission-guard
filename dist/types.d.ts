export type WFSLAdmissionSchemaId = "wfsl.admission.v1";
export type WFSLPosture = "deny";
export type WFSLSurfaceKind = "page" | "api" | "asset";
export type WFSLAudience = "public" | "system";
export type WFSLIndexing = "allowed" | "disallowed";
export type WFSLEvidenceMode = "summary" | "full";
export type WFSLSurface = {
    path: string;
    kind: WFSLSurfaceKind;
    audience: WFSLAudience;
    intent: string;
    methods?: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD">;
    indexing?: WFSLIndexing;
    tags?: string[];
    expires_at?: string;
};
export type WFSLAdmissionDefaults = {
    refusal_status: number;
    refusal_code: string;
    evidence: WFSLEvidenceMode;
};
export type WFSLAdmissionIntegrity = {
    manifest_id?: string;
    issuer?: string;
    created_at?: string;
    hash?: string;
};
export type WFSLAdmissionManifestV1 = {
    schema: WFSLAdmissionSchemaId;
    manifest_version: string;
    posture: WFSLPosture;
    surfaces: WFSLSurface[];
    defaults: WFSLAdmissionDefaults;
    integrity?: WFSLAdmissionIntegrity;
};
export type WFSLDecisionOutcome = "ADMITTED" | "REFUSED" | "ERROR";
export type WFSLDecisionCode = "ADMITTED" | "ADMISSION_MANIFEST_INVALID" | "SURFACE_NOT_ADMITTED" | "METHOD_NOT_ADMITTED" | "SURFACE_EXPIRED";
export type WFSLDecisionInput = {
    pathname: string;
    method?: string;
    now?: Date;
};
export type WFSLDecisionEvidence = {
    schema: WFSLAdmissionSchemaId;
    manifest_version?: string;
    manifest_id?: string;
    issuer?: string;
    route: string;
    method?: string;
    outcome: WFSLDecisionOutcome;
    code: WFSLDecisionCode;
    status: number;
    posture: WFSLPosture;
    timestamp: string;
};
export type WFSLDecisionResult = {
    ok: true;
    outcome: "ADMITTED";
    status: 200;
    evidence: WFSLDecisionEvidence;
    surface: WFSLSurface;
} | {
    ok: true;
    outcome: "REFUSED";
    status: number;
    evidence: WFSLDecisionEvidence;
} | {
    ok: false;
    outcome: "ERROR";
    status: 500;
    evidence: WFSLDecisionEvidence;
    errors: unknown;
};
//# sourceMappingURL=types.d.ts.map