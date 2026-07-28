import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const pathSegments = Array.isArray(path) ? path.join('/') : path || '';

  const BACKEND_URL = 
    process.env.VITE_API_URL || 
    process.env.BACKEND_URL || 
    'http://it-park-backend-env.eba-ybma3g2x.us-east-1.elasticbeanstalk.com/api';

  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  const targetUrl = baseUrl.endsWith('/api')
    ? `${baseUrl}/${pathSegments}`
    : `${baseUrl}/api/${pathSegments}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }

  try {
    const options: RequestInit = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method || '') && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const backendRes = await fetch(targetUrl, options);
    const text = await backendRes.text();
    
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return res.status(backendRes.status).json(data);
  } catch (error: any) {
    console.error(`Vercel API Proxy Error [/${pathSegments}]:`, error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Backend server bilan bog\'lanishda xatolik yuz berdi.',
    });
  }
}
