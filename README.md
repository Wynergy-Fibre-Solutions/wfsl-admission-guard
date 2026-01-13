# WFSL Admission Guard

**Deny-by-default admission enforcement for modern web systems.**

WFSL Admission Guard prevents applications from exposing routes or interfaces that have not been explicitly declared, admitted, and approved.

It is designed for teams that prioritise correctness, governance, and auditability over convenience.

---

## What this does

WFSL Admission Guard:

- Discovers routes in Next.js App Router projects
- Compares discovered surfaces against an explicit admission manifest
- Fails CI if any route exists without admission
- Produces deterministic, machine-verifiable outcomes

Nothing is inferred. Nothing is guessed.

---

## Why this exists

Most systems expose behaviour accidentally.

Routes are added implicitly, refactors drift, and security posture degrades without detection.

WFSL Admission Guard enforces a single non-negotiable rule:

> **If it is not explicitly admitted, it does not exist.**

This reduces:

- Accidental public exposure
- Undeclared surface area
- Long-term drift
- Audit and compliance risk

---

## How it works (high level)

1. Allowed public surfaces are declared in `wfsl.admission.json`
2. The guard scans the project for actual routes
3. Any discovered route not present in the manifest causes failure
4. Failures are explicit, attributable, and machine-readable

No routes are auto-approved.  
No silent passes occur.

---

## Deterministic verification

WFSL Admission Guard supports deterministic, non-destructive verification.

Verification runs:

- Declare execution context explicitly
- Avoid reliance on platform introspection
- Emit structured JSON evidence
- Do not modify application or system state

Typical artefacts include:

- `environment.json`
- `execution-context.json`
- `run-*.json`

These artefacts demonstrate observed behaviour only.

---

## Intended use

WFSL Admission Guard is suitable for:

- CI pipelines
- Governance enforcement
- Security review
- Regulated environments
- Teams requiring explicit surface control

It is intentionally opinionated.

---

## Licensing and reliance

This repository is available under the **WFSL Community Edition**.

Source code access, execution, and experimentation are permitted.

**Production reliance, audit claims, or regulatory use are not permitted** without a Commercial Reliance Licence.

Verification artefacts demonstrate observed behaviour only and do not grant permission to rely.

See the canonical framework:

- `WFSL-LICENSING-AND-RELIANCE.md`

For commercial licensing enquiries:

licensing@wfsl.uk

---

## Status

- Verification: complete
- Deterministic evidence: emitted
- CI enforcement: deterministic
- Reliance granted: none

This repository reflects a verified, non-reliant community release.
