# YEAH! Business

YEAH! Business is the enterprise operations module of **YEAH! OS**.

The repository name and module id are retained as technical compatibility identifiers; the public product label is **YEAH! Business**.

## Purpose

The module is designed for private/on-prem-compatible business workflows with read-only access by default:

- internal documentation and FAQ;
- support and ticketing;
- read-only Business Cube access;
- read-only Business One access;
- document/invoice reconciliation;
- auditable enterprise operations.

## Current implementation state

The repository now exposes deployable serverless contracts:

- `GET /api/health` — authenticated module health/readiness;
- `GET /api/capabilities` — authenticated capability discovery.

Both require `x-yeah-module-token` matching `YEAH_BUSINESS_MODULE_TOKEN`.

The health response reports only whether dependency classes are configured; it never returns DSNs, paths, credentials or private network coordinates. Data operations are not promoted to live until a real read-only adapter is connected and verified.

## Security defaults

- read-only by default;
- no public business-data operations;
- no write actions in the current contract;
- service-to-service module token required;
- tenant isolation required for future data operations;
- audit required before production data access;
- internal network coordinates and credentials remain deployment secrets;
- capability discovery reports configuration booleans, never secret values.

## Environment contract

```text
YEAH_BUSINESS_MODULE_TOKEN
YEAH_BUSINESS_BASE_PATH
BUSINESS_CUBE_READONLY_DSN
BUSINESS_ONE_READONLY_DSN
DOCUMENT_SHARE_PATH
```

Only configure the data-source variables that are approved for the deployment. The module should remain fail-closed when a requested adapter is not configured.

## Control-plane integration

YEAH! OS should register this module by its stable internal id and present it publicly as **YEAH! Business**. Production promotion requires:

1. deployed HTTPS origin;
2. verified module-token authentication;
3. read-only adapter health;
4. server-derived tenant context;
5. durable audit sink;
6. explicit query allow-lists/data boundaries;
7. observability and incident ownership.

## Product rule

This is a reusable module, not a one-off consulting implementation. Customer-specific connection coordinates and credentials never belong in source control.
