import type { WFSLAdmissionManifestV1, WFSLDecisionInput, WFSLDecisionResult } from "./types.js";
export declare function parseManifestJson(jsonText: string): WFSLAdmissionManifestV1 | null;
export declare function decideAdmission(manifest: unknown, input: WFSLDecisionInput): WFSLDecisionResult;
//# sourceMappingURL=engine.d.ts.map