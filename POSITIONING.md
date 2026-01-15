\# WFSL Admission Guard – Positioning



Status: Commercially positionable  

Version: v2.0.0  

Category: Compliance Primitive



---



\## What this is



WFSL Admission Guard is a \*\*deterministic compliance primitive\*\* used to decide whether an action is permitted before it occurs.



It evaluates explicit rules and produces a clear allow or deny decision, with default-deny behaviour when no rule applies.



It is not a platform, a service, or a policy engine. It is a \*\*reliable building block\*\*.



---



\## The problem it solves



Many systems rely on:

\- Implicit permissions

\- Distributed checks

\- Environment trust

\- Developer discipline



These approaches create:

\- Undocumented behaviour

\- Audit gaps

\- Inconsistent enforcement

\- Compliance risk



WFSL Admission Guard replaces implicit trust with \*\*explicit, testable admission decisions\*\*.



---



\## How it works (plain English)



\- A request is presented: who, what action, what resource.

\- A declared policy is evaluated.

\- If a matching rule exists:

&nbsp; - Allow or deny is returned explicitly.

\- If no rule exists:

&nbsp; - The decision is deny by default.



The outcome is deterministic and side-effect free.



---



\## Why this is different



WFSL Admission Guard is designed for \*\*governance-first environments\*\*.



It provides:

\- Default-deny semantics

\- No hidden behaviour

\- No network trust

\- No runtime configuration drift

\- CI-enforced tests proving behaviour



The system does not guess, infer, or adapt silently.



---



\## Where it is used



WFSL Admission Guard is intended to be embedded into:



\- Regulated systems

\- Infrastructure platforms

\- Compliance-sensitive services

\- Internal control planes

\- Governance tooling



It is typically combined with signing, evidence, or licensing layers, but does not require them.



---



\## What it is not



WFSL Admission Guard is not:

\- An authentication system

\- An authorisation framework

\- A policy language runtime

\- A SaaS product

\- A GitHub Action (as of v2.0.0)



It is a \*\*controlled, auditable primitive\*\*, not an end-user product.



---



\## Commercial use



Commercial use is governed by `COMMERCIAL-LICENCE.md`.



Typical commercial arrangements include:

\- Annual organisational licences

\- Advisory and integration support

\- Custom guard implementations

\- Assurance or audit support (by agreement)



This allows organisations to rely on the guard in production systems without ambiguity.



---



\## Why organisations adopt it



Organisations adopt WFSL Admission Guard to:



\- Reduce compliance risk

\- Make control decisions explicit

\- Simplify audits

\- Demonstrate governance maturity

\- Avoid accidental exposure



It is chosen when correctness matters more than convenience.



---



\## Summary



WFSL Admission Guard is a \*\*small, precise component\*\* that delivers high trust.



It exists to make one thing true:



> If an action is allowed, it is allowed deliberately.  

> If it is denied, it is denied safely.



Nothing more. Nothing hidden.



