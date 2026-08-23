# YEAH! Business

YEAH! Business is the enterprise-operations module of **YEAH! OS**.

The repository name `INTITagent` and its internal module id are retained as technical compatibility identifiers; the public product label is **YEAH! Business**.

> Status: authenticated module contract / hardening. Health and capability discovery are implemented; business-data adapters must remain read-only and unpromoted until they are connected, authorized and verified in the target environment.

## Purpose

The module is designed for private/on-prem-compatible business workflows with read-only access by default:

- internal documentation and FAQ;
- support/ticketing context;
- read-only Business Cube access;
- read-only Business One access;
- document/invoice reconciliation;
- auditable enterprise operations.

## Current implementation state

Deployable serverless contracts:

```text
GET /api/health
GET /api/capabilities
```

Both require `x-yeah-module-token` matching `YEAH_BUSINESS_MODULE_TOKEN`.

The health response reports configuration/readiness state without returning DSNs, paths, credentials or private network coordinates. Data operations must not be promoted to live until a real approved adapter is connected and verified.

## Capability truth model

```text
configured → reachable → authenticated → adapter-verified → data-boundary-verified → production-approved
```

Capability discovery reports what the module is configured to support; it is not permission to assume an upstream database is reachable, correctly scoped or safe for arbitrary queries.

## Security defaults

- read-only by default;
- no public business-data operations;
- no write actions in the current contract;
- service-to-service module token required;
- tenant isolation required for future data operations;
- audit required before production data access;
- internal network coordinates and credentials remain deployment secrets;
- capability discovery reports configuration booleans, never secret values;
- fail closed when a requested adapter is unavailable or unapproved.

See [`SECURITY.md`](./SECURITY.md) and [`COMPLIANCE.md`](./COMPLIANCE.md) for repository-specific controls and governance notes.

## Environment contract

```text
YEAH_BUSINESS_MODULE_TOKEN
YEAH_BUSINESS_BASE_PATH
BUSINESS_CUBE_READONLY_DSN
BUSINESS_ONE_READONLY_DSN
DOCUMENT_SHARE_PATH
```

Only configure data sources approved for the deployment. Connection strings, filesystem/network paths and credentials never belong in source control or client/browser code.

## Repository map

The repository is intentionally small and contract-oriented:

```text
api/                  # Serverless module endpoints
module.manifest.json  # Stable module metadata / capability declaration
SECURITY.md            # Security policy and controls
COMPLIANCE.md          # Compliance/governance notes
README.md              # Public technical contract
```

There is no need to pretend this repository is a full monolithic application: its portfolio value is the controlled module boundary and the fact that unverified data access stays disabled.

## Control-plane integration

YEAH! OS should register this module by its stable internal id and present it publicly as **YEAH! Business**.

Production promotion requires:

1. deployed HTTPS origin;
2. verified module-token authentication;
3. read-only adapter health;
4. server-derived tenant context;
5. explicit query allow-lists and data boundaries;
6. durable audit sink and correlation ids;
7. observability, timeout/rate controls and incident ownership;
8. representative authorization/isolation tests against the target environment.

## Data governance

Business Cube, Business One, ticketing, documents and invoice data can contain confidential or personal information. Apply data minimization, least-privilege access, retention rules and field/query allow-lists before exposing any dataset through a module operation.

Health or capability responses must never leak sample records, internal hostnames, credentials or filesystem paths.

## Product rule

This is a reusable module, not a one-off consulting implementation. Customer-specific connection coordinates, credentials and business data remain deployment configuration and never belong in source control.

## License / internal boundary

No project-wide external license grant is implied by this README. Customer systems, internal data, connectors and third-party software remain subject to their applicable agreements, permissions and licenses.
