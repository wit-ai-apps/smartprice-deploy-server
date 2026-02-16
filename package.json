// Status check endpoint
// URL: https://your-project.vercel.app/api/status

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  return res.status(200).json({
    status: 'online',
    service: 'SmartPrice Deploy Server',
    version: '1.0.0',
    configured: !!(GITHUB_TOKEN && GITHUB_REPO),
    repo: GITHUB_REPO || 'not configured',
    endpoints: {
      deploy: '/api/deploy (POST)',
      status: '/api/status (GET)'
    }
  });
}
