import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/keys.constants';
import { AuthType } from '../enums/auth-type.enum';

export const Auth: (...authTypes: AuthType[]) => ReturnType<typeof SetMetadata> = (
  ...authTypes: AuthType[]
) => {
  return SetMetadata(AUTH_TYPE_KEY, authTypes);
};
