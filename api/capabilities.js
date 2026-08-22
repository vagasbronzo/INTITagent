const { createHash, timingSafeEqual } = require('crypto');

function tokenMatches(provided, expected) {
  if (!provided || !expected) return false;
  const a = createHash('sha256').update(String(provided)).digest();
  const b = createHash('sha256').update(String(expected)).digest();
  return timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });
  if (!tokenMatches(req.headers['x-yeah-module-token'], process.env.YEAH_BUSINESS_MODULE_TOKEN)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const capabilities = [
    { id: 'faq', mode: 'read-only', configured: Boolean(process.env.DOCUMENT_SHARE_PATH) },
    { id: 'document-repository', mode: 'read-only', configured: Boolean(process.env.DOCUMENT_SHARE_PATH) },
    { id: 'business-cube-readonly', mode: 'read-only', configured: Boolean(process.env.BUSINESS_CUBE_READONLY_DSN) },
    { id: 'business-one-readonly', mode: 'read-only', configured: Boolean(process.env.BUSINESS_ONE_READONLY_DSN) },
    { id: 'ticketing', mode: 'contract-only', configured: false },
    { id: 'invoice-reconciliation', mode: 'contract-only', configured: false }
  ];

  return res.status(200).json({
    service: 'YEAH! Business',
    status: 'contract-ready',
    capabilities,
    writesEnabled: false,
    generatedAt: new Date().toISOString()
  });
};
