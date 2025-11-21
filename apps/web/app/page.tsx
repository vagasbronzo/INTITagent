'use client';

import { useState } from 'react';

interface AgentResponse {
  answer: string;
  confidence: number;
  sources?: string[];
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>INTITagent - AI Assistant</h1>
      <p>On-premise AI assistant for Business Cube (NTS)</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="query" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Ask a question:
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me the schema for the customers table"
            rows={4}
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Submit Query'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fee', borderRadius: '4px', color: '#c00' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h2>Response</h2>
          <p><strong>Answer:</strong> {response.answer}</p>
          <p><strong>Confidence:</strong> {(response.confidence * 100).toFixed(0)}%</p>
          {response.sources && response.sources.length > 0 && (
            <p><strong>Sources:</strong> {response.sources.join(', ')}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h2>Features</h2>
        <ul>
          <li>Technical assistance for Business Cube (NTS)</li>
          <li>Information about tables, fields, keys, and relationships</li>
          <li>Query examples and SQL generation</li>
          <li>RAG on internal documentation</li>
        </ul>
      </div>
    </main>
  );
}
