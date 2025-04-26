import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * jwt service
     */
    private readonly jwtService: JwtService,

    /**
     * inject JWT configuration
     */
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    //Extract the request form execution context
    const request = context.switchToHttp().getRequest();
    //extract token for header

    const token = this.extractRequestFormHeader(request);

    //validate the token
    if (!token) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractRequestFormHeader(request: Request): string {
    const [, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
