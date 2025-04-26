import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { ENV } from '@src/env';
import { UserModule } from '../modules/user/user.module';
import { AccessTokenGuard } from './access-token/access-token.guard';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { PermissionGuard } from './permission/permission.guard';
import { CustomThrottlerGuard } from './throttlerGuard/customThrottler.guard';

@Module({
  imports: [
    // jwt access for token guard imports
    JwtModule,
    UserModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: ENV.security.RATE_LIMIT_MAX,
          ttl: ENV.security.RATE_LIMIT_TTL,
        },
      ],
    }),
  ],
  providers: [
    /** implementing guard to globally for all api */
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    /**Importing guards to the module as provider */
    AccessTokenGuard,
    PermissionGuard,

    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
  exports: [AccessTokenGuard, PermissionGuard],
})
export class GuardsModule {}
