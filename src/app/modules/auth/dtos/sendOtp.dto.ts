import { ApiProperty } from '@nestjs/swagger';
import { ENUM_VERIFICATION_TYPES } from '@src/shared';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'email/phonenumber/username',
  })
  @IsNotEmpty()
  @IsString()
  readonly identifier!: string;

  @ApiProperty({
    type: String,
    required: true,
    enum: ENUM_VERIFICATION_TYPES,
    example: ENUM_VERIFICATION_TYPES.SIGN_UP,
  })
  @IsNotEmpty()
  @IsEnum(ENUM_VERIFICATION_TYPES)
  readonly verificationType!: keyof typeof ENUM_VERIFICATION_TYPES;
}
