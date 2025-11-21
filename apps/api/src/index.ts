import Fastify from 'fastify';
import cors from '@fastify/cors';
import { INTITAgent } from '@intitagent/agent-core';

// Type definitions for API routes
interface QueryRequestBody {
  query: string;
  context?: string;
}

interface GenerateQueryRequestBody {
  description: string;
}

interface SchemaRouteParams {
  table?: string;
}

const fastify = Fastify({
  logger: true
});

// Enable CORS
fastify.register(cors, {
  origin: true
});

// Initialize agent
const agent = new INTITAgent();

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'intitagent-api', timestamp: new Date().toISOString() };
});

// Query endpoint
fastify.post<{
  Body: QueryRequestBody;
}>('/api/query', async (request, reply) => {
  try {
    const { query, context } = request.body;
    
    if (!query) {
      return reply.code(400).send({ error: 'Query is required' });
    }

    const response = await agent.query({ query, context });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return reply.code(500).send({ error: message });
  }
});

// Schema endpoint
fastify.get<{
  Params: SchemaRouteParams;
}>('/api/schema/:table?', async (request, reply) => {
  try {
    const { table } = request.params;
    const schema = await agent.getCubeSchema(table);
    return schema;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return reply.code(500).send({ error: message });
  }
});

// Query generation endpoint
fastify.post<{
  Body: GenerateQueryRequestBody;
}>('/api/generate-query', async (request, reply) => {
  try {
    const { description } = request.body;
    
    if (!description) {
      return reply.code(400).send({ error: 'Description is required' });
    }

    const query = await agent.generateQueryExample(description);
    return { query };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return reply.code(500).send({ error: message });
  }
});

// Start server
const start = async () => {
  try {
    // Initialize agent
    await agent.initialize();
    
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 API server running at http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
