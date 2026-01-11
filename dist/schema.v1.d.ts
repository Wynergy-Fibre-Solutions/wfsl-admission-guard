export declare const WFSL_ADMISSION_SCHEMA_V1: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://wfsl.uk/schemas/wfsl.admission.schema.v1.json";
    readonly title: "WFSL Admission Manifest v1";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["schema", "manifest_version", "posture", "surfaces", "defaults"];
    readonly properties: {
        readonly schema: {
            readonly type: "string";
            readonly const: "wfsl.admission.v1";
        };
        readonly manifest_version: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly posture: {
            readonly type: "string";
            readonly enum: readonly ["deny"];
        };
        readonly surfaces: {
            readonly type: "array";
            readonly minItems: 1;
            readonly items: {
                readonly $ref: "#/$defs/surface";
            };
        };
        readonly defaults: {
            readonly $ref: "#/$defs/defaults";
        };
        readonly integrity: {
            readonly $ref: "#/$defs/integrity";
        };
    };
    readonly $defs: {
        readonly surface: {
            readonly type: "object";
            readonly additionalProperties: false;
            readonly required: readonly ["path", "kind", "audience", "intent"];
            readonly properties: {
                readonly path: {
                    readonly type: "string";
                    readonly pattern: "^/.*";
                };
                readonly kind: {
                    readonly type: "string";
                    readonly enum: readonly ["page", "api", "asset"];
                };
                readonly audience: {
                    readonly type: "string";
                    readonly enum: readonly ["public", "system"];
                };
                readonly intent: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly maxLength: 240;
                };
                readonly methods: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly enum: readonly ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
                    };
                    readonly minItems: 1;
                    readonly uniqueItems: true;
                };
                readonly indexing: {
                    readonly type: "string";
                    readonly enum: readonly ["allowed", "disallowed"];
                };
                readonly tags: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly minLength: 1;
                        readonly maxLength: 64;
                    };
                    readonly uniqueItems: true;
                };
                readonly expires_at: {
                    readonly type: "string";
                    readonly format: "date-time";
                };
            };
        };
        readonly defaults: {
            readonly type: "object";
            readonly additionalProperties: false;
            readonly required: readonly ["refusal_status", "refusal_code", "evidence"];
            readonly properties: {
                readonly refusal_status: {
                    readonly type: "integer";
                    readonly minimum: 400;
                    readonly maximum: 599;
                    readonly default: 451;
                };
                readonly refusal_code: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly maxLength: 64;
                    readonly default: "SURFACE_NOT_ADMITTED";
                };
                readonly evidence: {
                    readonly type: "string";
                    readonly enum: readonly ["summary", "full"];
                    readonly default: "summary";
                };
            };
        };
        readonly integrity: {
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly manifest_id: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly maxLength: 80;
                };
                readonly issuer: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly maxLength: 120;
                };
                readonly created_at: {
                    readonly type: "string";
                    readonly format: "date-time";
                };
                readonly hash: {
                    readonly type: "string";
                    readonly minLength: 8;
                    readonly maxLength: 256;
                };
            };
        };
    };
};
//# sourceMappingURL=schema.v1.d.ts.map