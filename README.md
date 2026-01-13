# WFSL Admission Guard

**Deny-by-default admission enforcement for modern web systems.**

WFSL Admission Guard prevents applications from exposing routes or interfaces that have not been explicitly declared, admitted, and approved.

It is designed for teams that prioritise correctness, governance, auditability, and deterministic behaviour over convenience.

---

## What this does

WFSL Admission Guard:

- Discovers routes in Next.js App Router projects
- Compares discovered surfaces against an explicit admission manifest
- Fails CI if any route exists without admission
- Produces deterministic, machine-verifiable outcomes
- Operates without inference, heuristics, or guesswork

If a route is not declared, it is treated as non-existent.

---

## Why this exists

Most systems expose behaviour accidentally.

Routes are added implicitly, refactors drift, and security posture degrades over time without detection.

WFSL Admission Guard enforces a single non-negotiable rule:

> **If it is not explicitly admitted, it does not exist.**

This reduces:

- Accidental public exposure
- Undeclared surface area
- Long-term configuration drift
- Audit and compliance risk
- Silent failures in CI and production

---

## How it works (high level)

1. You define allowed public surfaces in `wfsl.admission.json`
2. The guard scans your project for actual routes
3. Any discovered route not present in the manifest causes failure
4. Failures are explicit, attributable, and machine-readable

No behaviour is inferred.  
No routes are auto-approved.  
No silent passes occur.

---

## Deterministic verification

WFSL Admission Guard supports deterministic, non-destructive verification.

A verification harness is provided to:

- Declare execution context explicitly
- Capture platform and runtime state
- Emit evidence as structured JSON
- Record failures as first-class data

Verification runs do not modify the system under inspection.

Generated artefacts include:

- `environment.json`
- `execution-context.json`
- `run-*.json`

These artefacts enable independent review and audit without rerunning the tool.

---

## Usage (GitHub Actions)

```yaml
- name: WFSL Admission Guard
  uses: wfsl/wfsl-admission-guard@v1
  with:
    root: .
    manifest: wfsl.admission.json
    mode: strict
    fail_on_dynamic: "true"
