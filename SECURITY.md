# Security Policy

## Security objective

INTIT Agent / Quista AI follows the NEXALITH compliance baseline in `COMPLIANCE.md`. Because it is intended for on-prem and business-system integrations, connector isolation, tenant separation, least privilege and auditability are mandatory.

## Supported versions

Only the current default branch and explicitly maintained releases are supported for security remediation unless a release states otherwise.

## Reporting a vulnerability

Do not disclose vulnerabilities through a public issue or pull request. Report privately to the repository owner/security contact configured for the deployment. Include affected version/commit, impact, reproduction steps and logs with secrets redacted.

## Release blockers

Production release is blocked by cross-tenant exposure, exposed credentials, unauthorized ERP/business-system writes, broken authorization, unaudited connector actions, unresolved Critical vulnerabilities, or unresolved High vulnerabilities without documented risk acceptance.

## Connector policy

Connectors are read-only by default. Write access requires explicit enablement, authorization, scoped credentials, validation, human approval for material actions and an audit record. Service accounts must be separated from human identities.

## Data and AI safety

Do not send unnecessary personal or sensitive business data to external model providers. Apply minimization/redaction where feasible. Grounded answers must preserve citations. If data or permission is insufficient, the system must fail safely or hand over to a human operator rather than fabricate.

## Secrets

Secrets must not be committed to Git. Use runtime environment/secret-manager injection. Any committed credential must be removed, rotated, assessed for historical exposure and handled as a security incident.
