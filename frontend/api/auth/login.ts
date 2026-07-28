import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get live AWS backend URL from environment variables or default fallback
  const BACKEND_URL = 
    process.env.VITE_API_URL || 
    process.env.BACKEND_URL || 
    'http://it-park-backend-env.eba-ybma3g2x.us-east-1.elasticbeanstalk.com/api';

  const baseUrl = BACKEND_URL.replace(/\/+$/, '');
  const targetUrl = baseUrl.endsWith('/api')
    ? `${baseUrl}/auth/login`
    : `${baseUrl}/api/auth/login`;

  try {
    const backendRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const responseText = await backendRes.text();
    let data: any = null;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: responseText || 'No response body from backend' };
    }

    if (!backendRes.ok) {
      return res.status(backendRes.status || 400).json(
        data || { success: false, message: `Backend error (${backendRes.status})` }
      );
    }

    // Ensure access_token, token, accessToken aliases exist in return JSON
    const token = data?.access_token || data?.token || data?.accessToken;
    const user = data?.user || { name: 'Admin' };

    return res.status(200).json({
      access_token: token,
      token: token,
      accessToken: token,
      user: user,
      ...data,
    });
  } catch (error: any) {
    console.error('Vercel Serverless Function Proxy Error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Backend server bilan bog\'lanishda xatolik yuz berdi.',
    });
  }
}
