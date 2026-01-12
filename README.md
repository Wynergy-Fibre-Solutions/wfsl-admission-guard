# WFSL Admission Guard

**Deny-by-default admission enforcement for modern web systems.**

WFSL Admission Guard prevents applications from exposing routes or interfaces that have not been explicitly declared and approved.

It is designed for teams that value correctness, governance, and auditability over convenience.

---

## What this does

- Discovers routes in Next.js App Router projects
- Compares discovered surfaces against an explicit admission manifest
- Fails CI if any route exists without admission
- Produces deterministic, auditable outcomes

Nothing is inferred. Nothing is guessed.

---

## Why this exists

Most systems accidentally expose behaviour.

WFSL Admission Guard enforces a simple rule:

> **If it is not explicitly admitted, it does not exist.**

This reduces:
- Accidental public exposure
- Drift over time
- Audit risk
- Silent failures

---

## How it works (high level)

1. You define allowed public surfaces in `wfsl.admission.json`
2. The action scans your project for routes
3. Any discovered route not in the manifest causes CI to fail
4. Failures are explicit and machine-readable

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
