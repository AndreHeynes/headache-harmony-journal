// Server-side rate limiter for edge functions
// Uses in-memory storage (resets on function cold start)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  'auth-url': { maxRequests: 5, windowMs: 60 * 1000 },      // 5 auth attempts per minute
  'sync': { maxRequests: 10, windowMs: 60 * 1000 },         // 10 syncs per minute
  'default': { maxRequests: 30, windowMs: 60 * 1000 },      // 30 requests per minute
};

export function checkRateLimit(
  identifier: string, 
  action: string = 'default'
): { allowed: boolean; retryAfter?: number } {
  const config = DEFAULT_LIMITS[action] || DEFAULT_LIMITS['default'];
  const key = `${identifier}:${action}`;
  const now = Date.now();
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    for (const [k, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true };
  }
  
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  entry.count++;
  return { allowed: true };
}

export function rateLimitResponse(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ 
      error: 'Rate limit exceeded', 
      message: `Too many requests. Please try again in ${retryAfter} seconds.` 
    }),
    { 
      status: 429, 
      headers: { 
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      } 
    }
  );
}
