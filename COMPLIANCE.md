# NEXALITH Compliance Baseline v1

This repository is governed by the NEXALITH security and compliance baseline. The baseline is designed to support readiness for ISO/IEC 27001:2022, NIS2, NIST CSF 2.0, SOC 2 Trust Services Criteria, the EU AI Act where applicable, and GDPR where personal data is processed.

This document does **not** claim certification or legal compliance by itself. Certification and regulatory compliance also depend on deployment, organizational controls, contracts, operations, evidence, and independent assessment.

## Mandatory engineering gates

1. No production secrets, API keys, private keys, tokens, or `.env` files may be committed.
2. Enforce least privilege, explicit authorization, tenant isolation for tenant-scoped data, and deny-by-default privileged access.
3. Use pull-request review, repeatable builds, dependency/vulnerability checks, and remediate Critical/High findings before production release.
4. Security-relevant actions, policy changes, privileged operations, connector calls, and state-changing AI actions must be attributable and auditable without logging secrets.
5. Apply data minimization, classification, retention, deletion/export workflows where required, and residency controls for regulated deployments.
6. Preserve provenance/citations for grounded AI outputs. High-impact actions require policy evaluation and explicit human approval.
7. Maintain dependencies and release traceability. SBOM generation is a production release target.
8. Security issues require owner, severity, remediation path, and closure evidence.

## Release blockers

- cross-tenant data exposure;
- committed production secret;
- broken authorization or privilege escalation;
- unresolved Critical vulnerability;
- unresolved High vulnerability without approved risk acceptance;
- unaudited privileged or infrastructure-changing action.

## Control families

- Governance & risk
- Identity & access management
- Secure development lifecycle
- Logging, monitoring & audit
- Resilience & recovery
- Software/supplier supply-chain security
- Data governance & privacy
- AI governance & human oversight

Policy text is not proof of operating effectiveness. Evidence must come from implementation, tests, CI, deployment controls and audit records.
