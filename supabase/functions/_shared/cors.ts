// Centralized CORS configuration with domain restriction

const ALLOWED_ORIGINS = [
  'https://vbutzblgbexuwedzayjv.lovable.app',
  'https://lovable.dev',
  // Add production domains here
];

// For development, also allow localhost
if (Deno.env.get('ENVIRONMENT') !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000');
}

export function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  // Check if the request origin is allowed
  const origin = requestOrigin && ALLOWED_ORIGINS.some(allowed => 
    requestOrigin === allowed || requestOrigin.endsWith('.lovable.app')
  ) ? requestOrigin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleCorsPreflightRequest(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.get('Origin');
    return new Response(null, { headers: getCorsHeaders(origin) });
  }
  return null;
}
