export interface AdmissionResult {
    admitted: boolean;
    reasons: string[];
    evidencePath: string;
}
export declare function runAdmission(root: string): AdmissionResult;
