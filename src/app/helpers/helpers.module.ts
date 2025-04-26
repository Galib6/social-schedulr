import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BcryptHelper } from './bcrypt.helper';
import { EmailHelper } from './email.helper';
import { HtmlHelper } from './html.helper';
import { JWTHelper } from './jwt.helper';

const HELPERS = [BcryptHelper, JWTHelper, EmailHelper, HtmlHelper];

@Global()
@Module({
  imports: [JwtModule],
  providers: [...HELPERS],
  exports: [...HELPERS],
})
export class HelpersModule {}
