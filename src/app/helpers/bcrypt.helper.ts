import { Injectable } from '@nestjs/common';
import { ENV } from '@src/env';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHelper {
  public hash(plainText: string, saltRounds: number = ENV.jwt.saltRound): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  }

  public compareHash(plainText: string, hashString: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashString);
  }
}
