import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'user@wh.com',
  })
  @IsNotEmpty()
  @IsString()
  readonly email!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '8801312121221',
  })
  @IsOptional()
  readonly phoneNumber?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'username',
  })
  @IsOptional()
  readonly username?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Zahid Hassan',
  })
  @IsNotEmpty()
  @IsString()
  readonly fullName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  readonly password!: string;

  // @ApiProperty({
  //   type: String,
  //   required: true,
  // })
  // @IsOptional()
  // @IsEnum(ENUM_ACL_DEFAULT_ROLES)
  // readonly role!: string;
}

export class AppRegisterDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'user@wh.com',
  })
  @IsNotEmpty()
  @IsString()
  readonly email!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Zahid Hassan',
  })
  @IsNotEmpty()
  @IsString()
  readonly fullName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  readonly password!: string;
}
