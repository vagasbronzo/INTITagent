# INTITagent

Agente AI on-prem per INTIT:
- assistente tecnico Business Cube (NTS): tabelle, campi, chiavi, relazioni, query d’esempio
- RAG su documentazione interna
- ingest da share **//srvnts/ia**
- console web su **http://srvnts/ia** (basePath `/ia`)
- API interne per orchestrazione agente, retrieval e ingest

## Monorepo
- apps/: api (NestJS/Fastify), web (Next.js), worker (cron/ingest)
- packages/: agent-core, prompts, connectors (SMB), retrieval, cube-schemas, db, logger, telemetry, shared
- infra/: docker/k8s/ingress
- config/: env, nginx, policy

## Dev rapido
```bash
pnpm i
docker compose -f infra/docker/docker-compose.dev.yml up -d
pnpm -r build
pnpm -r dev
# web: http://srvnts/ia  | api: http://srvnts/ia/api
