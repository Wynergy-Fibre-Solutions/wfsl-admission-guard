\# WFSL Admission Guard — Governance



\## Purpose

This document defines governance, change control, and stewardship rules for

WFSL Admission Guard.



The objective is to ensure deterministic, explainable admission decisions

that can be trusted in professional and regulated workflows.



\## Authority Binding

WFSL Admission Guard operates under WFSL Pro Authority principles.



Released behaviour is authoritative once tagged and published.



\## Change Control



\### Permitted Changes

The following MAY occur without a major version increment:

\- Documentation clarifications

\- Internal refactoring with no behavioural change

\- Performance improvements with identical outcomes



\### Restricted Changes

The following REQUIRE a major version increment:

\- Admission rule changes

\- Decision semantics changes

\- Exit code changes

\- Configuration interpretation changes

\- Any change that could alter an admission decision



\### Forbidden Changes

\- Telemetry or data collection

\- Network access

\- Non-deterministic evaluation

\- Retroactive modification of released tags

\- Bypassing branch protections



\## Versioning

Strict semantic versioning applies.



Released tags are immutable and authoritative.



\## Stewardship

WFSL Admission Guard prioritises:

\- Determinism over flexibility

\- Explicit decisions over implicit behaviour

\- Auditability over convenience



This tool is stewarded for long-term reliability and governance integrity.



