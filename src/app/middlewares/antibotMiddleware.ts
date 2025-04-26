import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const BLOCKED_USER_AGENTS = [/curl/i, /wget/i, /python/i, /scrapy/i, /bot/i, /spider/i];
const BLOCKED_REFERERS = [/^http:\/\/badreferer\.com/i];

@Injectable()
export class AntiBotMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any {
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';

    // Block empty or suspicious user agents
    if (!userAgent || BLOCKED_USER_AGENTS.some((pattern) => pattern.test(userAgent))) {
      // Optionally log the attempt here
      return res.status(403).json({ message: 'Forbidden: Bot detected' });
    }

    // Block suspicious referers
    if (BLOCKED_REFERERS.some((pattern) => pattern.test(referer))) {
      return res.status(403).json({ message: 'Forbidden: Suspicious referer' });
    }

    // Block requests missing common headers
    if (!req.headers['accept'] || !req.headers['accept-language']) {
      return res.status(403).json({ message: 'Forbidden: Suspicious headers' });
    }

    next();
  }
}
