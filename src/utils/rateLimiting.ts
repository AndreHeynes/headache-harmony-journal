
/**
 * Rate Limiting Utility
 * Prevents abuse of export functionality during beta testing
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  export: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 exports per minute
  download: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 downloads per minute
};

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();

  private getKey(userId: string, action: string): string {
    return `${userId}:${action}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }

  isAllowed(userId: string, action: string): boolean {
    this.cleanup();
    
    const config = DEFAULT_RATE_LIMITS[action];
    if (!config) {
      console.warn(`No rate limit config for action: ${action}`);
      return true;
    }

    const key = this.getKey(userId, action);
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.storage.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (entry.count >= config.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(userId: string, action: string): number {
    const config = DEFAULT_RATE_LIMITS[action];
    if (!config) return Infinity;

    const key = this.getKey(userId, action);
    const entry = this.storage.get(key);
    
    if (!entry || Date.now() > entry.resetTime) {
      return config.maxRequests;
    }

    return Math.max(0, config.maxRequests - entry.count);
  }

  getResetTime(userId: string, action: string): number | null {
    const key = this.getKey(userId, action);
    const entry = this.storage.get(key);
    
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }

    return entry.resetTime;
  }
}

export const rateLimiter = new RateLimiter();

export const checkRateLimit = (userId: string, action: string): { allowed: boolean; message?: string } => {
  const allowed = rateLimiter.isAllowed(userId, action);
  
  if (!allowed) {
    const resetTime = rateLimiter.getResetTime(userId, action);
    const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
    
    return {
      allowed: false,
      message: `Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`
    };
  }

  return { allowed: true };
};
