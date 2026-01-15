/**
 * WFSL Admission Guard — Engine Tests
 *
 * Deterministic behavioural tests.
 */

import { evaluateAdmission, AdmissionPolicy } from './engine';

const policy: AdmissionPolicy = {
  version: 'v1',
  rules: [
    {
      subject: 'user:alice',
      action: 'read',
      resource: 'doc:public',
      allow: true
    },
    {
      subject: 'user:bob',
      action: 'write',
      resource: 'doc:public',
      allow: false
    }
  ]
};

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Explicit allow
 */
const allowDecision = evaluateAdmission(
  { subject: 'user:alice', action: 'read', resource: 'doc:public' },
  policy
);

assert(allowDecision.allowed === true, 'expected explicit allow');
assert(allowDecision.policyVersion === 'v1', 'policy version mismatch');

/**
 * Explicit deny
 */
const denyDecision = evaluateAdmission(
  { subject: 'user:bob', action: 'write', resource: 'doc:public' },
  policy
);

assert(denyDecision.allowed === false, 'expected explicit deny');

/**
 * No matching rule → deny
 */
const defaultDeny = evaluateAdmission(
  { subject: 'user:eve', action: 'read', resource: 'doc:public' },
  policy
);

assert(defaultDeny.allowed === false, 'expected default deny');

console.log('Admission engine tests passed');
