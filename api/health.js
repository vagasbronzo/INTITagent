const { createHash, timingSafeEqual } = require('crypto');

function tokenMatches(provided, expected) {
  if (!provided || !expected) return false;
  const a = createHash('sha256').update(String(provided)).digest();
  const b = createHash('sha256').update(String(expected)).digest();
  return timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

  const authorized = tokenMatches(req.headers['x-yeah-module-token'], process.env.YEAH_BUSINESS_MODULE_TOKEN);
  if (!authorized) return res.status(403).json({ error: 'forbidden' });

  const dependencies = {
    documentRepositoryConfigured: Boolean(process.env.DOCUMENT_SHARE_PATH),
    businessCubeReadOnlyConfigured: Boolean(process.env.BUSINESS_CUBE_READONLY_DSN),
    businessOneReadOnlyConfigured: Boolean(process.env.BUSINESS_ONE_READONLY_DSN)
  };

  return res.status(200).json({
    service: 'YEAH! Business',
    status: 'contract-ready',
    operationalDataAdapter: Object.values(dependencies).some(Boolean),
    mode: 'read-only-default',
    dependencies,
    writeActionsEnabled: false,
    generatedAt: new Date().toISOString()
  });
};
