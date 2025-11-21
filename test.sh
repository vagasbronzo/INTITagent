#!/bin/bash
set -e

echo "=========================================="
echo "INTITagent Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}✗ pnpm is not installed${NC}"
    echo "Installing pnpm..."
    npm install -g pnpm
fi

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
pnpm install --no-frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 2: Building packages...${NC}"
if pnpm -r build; then
    echo -e "${GREEN}✓ All packages built successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 3: Running linter...${NC}"
if pnpm -r lint; then
    echo -e "${GREEN}✓ All packages pass linting${NC}"
else
    echo -e "${RED}✗ Linting failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 4: Starting API server...${NC}"
cd apps/api
node dist/index.js &
API_PID=$!
cd ../..

# Wait for server to start
sleep 5

# Check if server is running
if ! kill -0 $API_PID 2>/dev/null; then
    echo -e "${RED}✗ API server failed to start${NC}"
    exit 1
fi
echo -e "${GREEN}✓ API server started (PID: $API_PID)${NC}"
echo ""

echo -e "${YELLOW}Step 5: Testing API endpoints...${NC}"
echo ""

# Test health endpoint
echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✓ Health endpoint working${NC}"
    echo "  Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}✗ Health endpoint failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test query endpoint
echo "Testing query endpoint..."
QUERY_RESPONSE=$(curl -s -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Test query"}')
if echo "$QUERY_RESPONSE" | grep -q "answer"; then
    echo -e "${GREEN}✓ Query endpoint working${NC}"
    echo "  Response: $(echo $QUERY_RESPONSE | cut -c1-100)..."
else
    echo -e "${RED}✗ Query endpoint failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test schema endpoint
echo "Testing schema endpoint..."
SCHEMA_RESPONSE=$(curl -s http://localhost:3001/api/schema/test)
if echo "$SCHEMA_RESPONSE" | grep -q "tableName"; then
    echo -e "${GREEN}✓ Schema endpoint working${NC}"
    echo "  Response: $SCHEMA_RESPONSE"
else
    echo -e "${RED}✗ Schema endpoint failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test query generation endpoint
echo "Testing query generation endpoint..."
GEN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/generate-query \
  -H "Content-Type: application/json" \
  -d '{"description": "Get active users"}')
if echo "$GEN_RESPONSE" | grep -q "query"; then
    echo -e "${GREEN}✓ Query generation endpoint working${NC}"
    echo "  Response: $(echo $GEN_RESPONSE | cut -c1-100)..."
else
    echo -e "${RED}✗ Query generation endpoint failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Cleanup
echo -e "${YELLOW}Step 6: Cleaning up...${NC}"
kill $API_PID 2>/dev/null || true
wait $API_PID 2>/dev/null || true
echo -e "${GREEN}✓ Cleanup completed${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}All tests passed successfully!${NC}"
echo "=========================================="
echo ""
echo "To test the web interface:"
echo "  1. Start API: cd apps/api && node dist/index.js"
echo "  2. Start Web: cd apps/web && NEXT_PUBLIC_API_URL=http://localhost:3001 node .next/standalone/apps/web/server.js"
echo "  3. Open browser: http://localhost:3000/ia"
echo ""
