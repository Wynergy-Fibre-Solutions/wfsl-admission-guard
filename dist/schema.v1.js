// Embedded JSON Schema for wfsl.admission.v1 (Draft 2020-12 compatible)
export const WFSL_ADMISSION_SCHEMA_V1 = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://wfsl.uk/schemas/wfsl.admission.schema.v1.json",
    title: "WFSL Admission Manifest v1",
    type: "object",
    additionalProperties: false,
    required: ["schema", "manifest_version", "posture", "surfaces", "defaults"],
    properties: {
        schema: { type: "string", const: "wfsl.admission.v1" },
        manifest_version: { type: "string", minLength: 1 },
        posture: { type: "string", enum: ["deny"] },
        surfaces: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/$defs/surface" }
        },
        defaults: { $ref: "#/$defs/defaults" },
        integrity: { $ref: "#/$defs/integrity" }
    },
    $defs: {
        surface: {
            type: "object",
            additionalProperties: false,
            required: ["path", "kind", "audience", "intent"],
            properties: {
                path: { type: "string", pattern: "^/.*" },
                kind: { type: "string", enum: ["page", "api", "asset"] },
                audience: { type: "string", enum: ["public", "system"] },
                intent: { type: "string", minLength: 1, maxLength: 240 },
                methods: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]
                    },
                    minItems: 1,
                    uniqueItems: true
                },
                indexing: { type: "string", enum: ["allowed", "disallowed"] },
                tags: {
                    type: "array",
                    items: { type: "string", minLength: 1, maxLength: 64 },
                    uniqueItems: true
                },
                expires_at: { type: "string", format: "date-time" }
            }
        },
        defaults: {
            type: "object",
            additionalProperties: false,
            required: ["refusal_status", "refusal_code", "evidence"],
            properties: {
                refusal_status: { type: "integer", minimum: 400, maximum: 599, default: 451 },
                refusal_code: { type: "string", minLength: 1, maxLength: 64, default: "SURFACE_NOT_ADMITTED" },
                evidence: { type: "string", enum: ["summary", "full"], default: "summary" }
            }
        },
        integrity: {
            type: "object",
            additionalProperties: false,
            properties: {
                manifest_id: { type: "string", minLength: 1, maxLength: 80 },
                issuer: { type: "string", minLength: 1, maxLength: 120 },
                created_at: { type: "string", format: "date-time" },
                hash: { type: "string", minLength: 8, maxLength: 256 }
            }
        }
    }
};
//# sourceMappingURL=schema.v1.js.map