# WFSL Admission Guard

Status: Pattern-aligned guard library  
Pattern: WFSL Guard Pattern v1  
Trust Baseline: TRUST.md

---

## Scope

WFSL Admission Guard is a guard **library** implementing admission-time enforcement according to the WFSL Guard Pattern.

It is not currently distributed as a GitHub Action.

---

## Guarantees

All guarantees are defined exclusively in `TRUST.md`.

No security, trust, or enforcement claims exist outside that document.

---

## Structure

- `scripts/`  
  Signing and verification entry points.

- `src/`  
  Admission logic and schemas.

- `.github/workflows/`  
  Policy and integration workflows enforcing the Guard Pattern.

---

## Non-Goals

This repository does not:
- Act as a GitHub Action wrapper.
- Expose mutable configuration.
- Perform authorisation decisions.
- Provide runtime network trust.

These concerns may be layered later as separate components.

---

## Change Control

Any change that alters scope or guarantees must update `TRUST.md` and pass CI.

Silent expansion of scope is not permitted.
