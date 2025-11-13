# INTITagent

Agente AI on-prem per INTIT:
- assistente tecnico Business Cube (NTS): tabelle, campi, chiavi, relazioni, query d’esempio
- RAG su documentazione interna
- ingest da share **//srvnts/ia**
- console web su **http://srvnts/ia** (basePath `/ia`)
- API interne per orchestrazione agente, retrieval e ingest

## Monorepo Structure
- `apps/`: Application services
  - `api`: API server (Fastify) - handles queries and agent operations
  - `web`: Web interface (Next.js) - user-facing chat interface
- `packages/`: Shared packages
  - `agent-core`: Core AI agent functionality
  - `shared`: Shared utilities and types
- `infra/`: Infrastructure configuration
  - `docker`: Docker and docker-compose files

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for development dependencies)

## Quick Start

1. **Install dependencies:**
```bash
pnpm install
```

2. **Start development services (PostgreSQL, Redis):**
```bash
docker compose -f infra/docker/docker-compose.dev.yml up -d
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Build all packages:**
```bash
pnpm -r build
```

5. **Start development servers:**
```bash
pnpm -r dev
```

This will start:
- Web interface: http://localhost:3000/ia
- API server: http://localhost:3001

## Development

### Build all packages
```bash
pnpm -r build
```

### Run all services in development mode
```bash
pnpm -r dev
```

### Run linting
```bash
pnpm -r lint
```

### Run tests
```bash
pnpm -r test
```

## Project Status

✅ Basic monorepo structure implemented
✅ Core agent package with placeholder AI functionality
✅ API server with query endpoints
✅ Web interface with chat UI
✅ Docker development environment
🔄 AI model integration (to be implemented)
🔄 RAG functionality (to be implemented)
🔄 Business Cube schema integration (to be implemented)
🔄 SMB connector for document ingestion (to be implemented)

## Contributing

This is an internal INTIT project. For questions or contributions, please contact the development team.
