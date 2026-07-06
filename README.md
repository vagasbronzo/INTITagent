# INTIT Agent / Quista AI

INTIT Agent is the **INTIT / Quista vertical module** for Astralyon OS.

It is designed as an on-prem compatible AI layer for Business Cube, Business One, internal documentation, FAQ, ticketing and invoice reconciliation.

## Role inside Astralyon OS

| Area | Responsibility |
| --- | --- |
| Quista AI | Productized assistant connected to the Quista ecosystem |
| Business Cube | Read-only technical assistant for tables, fields, keys, relations and query examples |
| Business One | Read-only operational connector |
| Help desk | FAQ, ticketing and customer support automation |
| Documents | RAG over internal documentation, manuals and procedures |
| Reconciliation | Invoice and document matching workflows |

## Product rule

This must remain a product module, not a consulting project.

The user experience must be one simple operational console:

- ask questions;
- search documents;
- open or classify tickets;
- inspect Business Cube / Business One data through safe read-only connectors;
- reconcile invoices;
- view audit and source citations.

## Deployment target

Original target remains supported:

```txt
web: http://srvnts/ia
api: http://srvnts/ia/api
basePath: /ia
document share: //srvnts/ia
```

## Monorepo target structure

```txt
apps/
├─ api      # NestJS/Fastify API
├─ web      # Next.js console
└─ worker   # ingest, cron, sync jobs

packages/
├─ agent-core
├─ prompts
├─ connectors
├─ retrieval
├─ cube-schemas
├─ db
├─ logger
├─ telemetry
└─ shared

infra/
├─ docker
├─ k8s
└─ ingress

config/
├─ env
├─ nginx
└─ policy
```

## Integration manifest

This module declares its role through:

```txt
module.manifest.json
```

Astralyon OS should use the manifest to register INTIT Agent as a vertical module.

## Priority roadmap

1. FAQ + ticketing
2. document RAG
3. Business Cube schema assistant
4. Business One read-only connector
5. invoice reconciliation
6. admin dashboard
7. omnichannel support: web, mobile, WhatsApp, Teams

## Security defaults

- read-only connector access by default;
- no sensitive data stored by default;
- tenant isolation required;
- every answer grounded in documents should show citations;
- every connector call should create an audit record;
- write actions require explicit approval.

## Development quickstart

```bash
pnpm i
docker compose -f infra/docker/docker-compose.dev.yml up -d
pnpm -r build
pnpm -r dev
```
