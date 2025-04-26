import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

const IP_WHITELIST = [
  '127.0.0.1', // Add your whitelisted IPs here
  '::1',
  // process.env.IP_WHITELIST?.split(',') // Or load from env
];

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || req.connection.remoteAddress;

    if (IP_WHITELIST.includes(ip)) {
      return true; // Bypass throttling
    }
    return super.canActivate(context);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ip;
  }
}
