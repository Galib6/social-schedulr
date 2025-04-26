import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENV } from '@src/env';
import * as OtpUtil from 'otp-without-db';
import { GenericObject } from '../types';

export interface IAuthUserResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    roles: string[];
  };
}

@Injectable()
export class JWTHelper {
  constructor(private readonly jwtService: JwtService) {}

  public async signToken<T extends object | Buffer>(
    expiresIn: string,
    payload?: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      audience: ENV.jwt.audience,
      issuer: ENV.jwt.issuer,
      secret: ENV.jwt.secret,
      expiresIn: expiresIn,
    });
  }

  public async verify(token: string): Promise<IAuthUserResponse> {
    try {
      return await this.jwtService.verifyAsync(token, ENV.jwt);
    } catch {
      throw new UnauthorizedException('Unauthorized Access Detected');
    }
  }

  public async verifyRefreshToken(token: string): Promise<any> {
    try {
      const decoded: any = await this.jwtService.verifyAsync(token, ENV.jwt);
      if (decoded.isRefreshToken) {
        return decoded;
      } else {
        throw new ForbiddenException('Unauthorized Access Detected');
      }
    } catch {
      throw new ForbiddenException('Unauthorized Access Detected');
    }
  }

  public extractToken(headers: GenericObject): string {
    let token: string = headers && headers.authorization ? headers.authorization : '';
    token = token.replace(/Bearer\s+/gm, '');
    return token;
  }

  public async makeAccessToken(
    data: GenericObject,
    tokenExpireIn: string = ENV.jwt.tokenExpireIn,
  ): Promise<string> {
    const payload = {
      ...data,
    };
    return await this.signToken<GenericObject>(tokenExpireIn, payload);
  }

  public async makeRefreshToken(
    data: GenericObject,
    tokenExpireIn: string = ENV.jwt.refreshTokenExpireIn,
  ): Promise<string> {
    const payload = {
      ...data,
    };
    return await this.signToken<GenericObject>(tokenExpireIn, payload);
  }

  public async makePermissionToken(
    data: GenericObject,
    tokenExpireIn: string = ENV.jwt.refreshTokenExpireIn,
  ): Promise<string> {
    const payload = {
      ...data,
    };
    return await this.signToken<GenericObject>(tokenExpireIn, payload);
  }

  public generateOtpHash(identifier: string, otp: number): string {
    return OtpUtil.createNewOTP(identifier, otp, ENV.jwt.secret, 5);
  }

  public verifyOtpHash(identifier: string, otp: number, otpHash: string): boolean {
    return OtpUtil.verifyOTP(identifier, otp, otpHash, ENV.jwt.secret);
  }
}
