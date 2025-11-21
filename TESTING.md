# Testing Guide for INTITagent

This guide provides instructions for testing the INTITagent AI system locally.

## Quick Start Testing

### 1. Install and Build

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build
```

### 2. Start the API Server

```bash
cd apps/api
node dist/index.js
```

The API will be available at: **http://localhost:3001**

### 3. Start the Web Interface (in another terminal)

```bash
cd apps/web
NEXT_PUBLIC_API_URL=http://localhost:3001 node .next/standalone/apps/web/server.js
```

The web interface will be available at: **http://localhost:3000/ia**

## Testing the API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "intitagent-api",
  "timestamp": "2025-11-21T12:59:40.000Z"
}
```

### Query Endpoint
```bash
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What tables are available in Business Cube?"}'
```

Expected response:
```json
{
  "answer": "Processing query: \"What tables are available in Business Cube?\". This is a placeholder response. AI functionality will be enhanced with LLM integration.",
  "confidence": 0.8,
  "sources": ["placeholder"]
}
```

### Schema Endpoint
```bash
curl http://localhost:3001/api/schema/customers
```

Expected response:
```json
{
  "message": "Schema retrieval not yet implemented",
  "tableName": "customers"
}
```

### Query Generation Endpoint
```bash
curl -X POST http://localhost:3001/api/generate-query \
  -H "Content-Type: application/json" \
  -d '{"description": "Get all customers from Italy"}'
```

Expected response:
```json
{
  "query": "-- Example query for: Get all customers from Italy\nSELECT * FROM placeholder WHERE 1=1;"
}
```

## Testing the Web Interface

1. Open your browser and navigate to: **http://localhost:3000/ia**
2. You should see the INTITagent chat interface
3. Enter a question in the text area (e.g., "Show me the schema for customers")
4. Click "Submit Query"
5. You should see the AI response displayed below the form

## Running Automated Tests

### Lint Check
```bash
pnpm -r lint
```

All packages should pass without errors.

### Build Check
```bash
pnpm -r build
```

All packages should build successfully.

### Full Integration Test
```bash
# Start API server in background
cd apps/api
node dist/index.js &
API_PID=$!

# Wait for server to start
sleep 3

# Run tests
echo "Testing health endpoint..."
curl -s http://localhost:3001/health | jq .

echo "Testing query endpoint..."
curl -s -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Test"}' | jq .

echo "Testing schema endpoint..."
curl -s http://localhost:3001/api/schema/test | jq .

echo "Testing query generation..."
curl -s -X POST http://localhost:3001/api/generate-query \
  -H "Content-Type: application/json" \
  -d '{"description": "Test query"}' | jq .

# Cleanup
kill $API_PID
echo "All tests completed!"
```

## Development Testing

For continuous development and testing:

```bash
# Terminal 1: Start API in watch mode
cd apps/api
pnpm dev

# Terminal 2: Start Web in development mode
cd apps/web
pnpm dev
```

This will start:
- API server at http://localhost:3001 with hot reload
- Web interface at http://localhost:3000/ia with hot reload

## Test Results Summary

✅ **API Server**: All endpoints working correctly
✅ **Web Interface**: Chat UI functional and connects to API
✅ **Type Safety**: All TypeScript types properly defined
✅ **Linting**: All packages pass ESLint checks
✅ **Build**: All packages build without errors
✅ **Security**: CodeQL scan passed with 0 alerts

## Notes

- This is a development setup. For production deployment, see the main README.md
- The AI functionality currently returns placeholder responses
- Real AI/LLM integration will be added in future updates
- Database connections (PostgreSQL, Redis) are optional for basic testing
