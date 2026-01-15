/**
 * WFSL Admission Guard — Engine
 *
 * Deterministic, side-effect free admission evaluation.
 * No signing. No I/O. No environment dependence.
 */

export type AdmissionRequest = {
  subject: string;
  action: string;
  resource: string;
  context?: Record<string, unknown>;
};

export type AdmissionDecision = {
  allowed: boolean;
  reason: string;
  policyVersion: string;
};

export type AdmissionPolicy = {
  version: string;
  rules: Array<{
    subject: string;
    action: string;
    resource: string;
    allow: boolean;
  }>;
};

export function evaluateAdmission(
  request: AdmissionRequest,
  policy: AdmissionPolicy
): AdmissionDecision {
  const match = policy.rules.find(
    r =>
      r.subject === request.subject &&
      r.action === request.action &&
      r.resource === request.resource
  );

  if (!match) {
    return {
      allowed: false,
      reason: 'no matching rule',
      policyVersion: policy.version
    };
  }

  return {
    allowed: match.allow,
    reason: match.allow ? 'explicit allow' : 'explicit deny',
    policyVersion: policy.version
  };
}
