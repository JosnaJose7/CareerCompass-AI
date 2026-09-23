import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { logger } from '../services/logger';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const clientRequestStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of clientRequestStore.entries()) {
    if (now > record.resetTime) {
      clientRequestStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  guestMaxRequests?: number;
  endpointName: string;
}

/**
 * Creates an intelligent rate limiter distinguishing authenticated students vs guest clients
 */
export function createTieredRateLimiter(options: RateLimiterOptions) {
  const { windowMs, maxRequests, guestMaxRequests = Math.max(5, Math.floor(maxRequests / 2)), endpointName } = options;

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const isGuest = !req.user || req.user.uid === 'guest' || (req.user as any).isGuest;
    const clientKey = !isGuest && req.user?.uid 
      ? `user:${req.user.uid}:${endpointName}` 
      : `ip:${req.ip || req.socket.remoteAddress || 'unknown'}:${endpointName}`;

    const limit = isGuest ? guestMaxRequests : maxRequests;
    const now = Date.now();
    const record = clientRequestStore.get(clientKey);

    if (!record || now > record.resetTime) {
      clientRequestStore.set(clientKey, {
        count: 1,
        resetTime: now + windowMs
      });
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', limit - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      return next();
    }

    if (record.count >= limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

      logger.warn('Rate limit exceeded', {
        route: req.path,
        method: req.method,
        clientKey,
        isGuest,
        limit,
        retryAfterSeconds
      });

      return res.status(429).json({
        error: isGuest
          ? 'Guest rate limit reached. Please sign in for higher request allowances, or wait a moment.'
          : 'Request limit reached for this AI operation. Please wait a moment before trying again.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: retryAfterSeconds
      });
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - record.count);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
    next();
  };
}

// 1. Global API rate limit
export const globalApiLimiter = createTieredRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  guestMaxRequests: 60,
  endpointName: 'global'
});

// 2. Rate limiter for expensive AI operations (Resume parsing + ATS audit, Assessment report, Roadmap)
export const expensiveAiLimiter = createTieredRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 25,
  guestMaxRequests: 10,
  endpointName: 'expensive-ai'
});

// 3. Rate limiter for standard interactive AI operations (Chat advisor, Interview questions, Interview evaluation, Skill gaps, What-if simulator)
export const standardAiLimiter = createTieredRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 45,
  guestMaxRequests: 20,
  endpointName: 'standard-ai'
});

// 4. Rate limiter for public labor market queries
export const publicMarketLimiter = createTieredRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  guestMaxRequests: 40,
  endpointName: 'market-insights'
});

// Legacy backward-compatible export
export function createRateLimiter(windowMs: number = 60 * 1000, maxRequests: number = 60) {
  return createTieredRateLimiter({
    windowMs,
    maxRequests,
    endpointName: 'default'
  });
}
