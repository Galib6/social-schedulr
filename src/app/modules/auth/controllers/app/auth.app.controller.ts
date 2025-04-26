import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { IAuthUser, ILginResponse } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { ENUM_ACL_DEFAULT_ROLES } from '@src/shared';
import { ChangePasswordDTO } from '../../dtos/changePassword.dto';
import { LoginDTO } from '../../dtos/login.dto';
import { RefreshTokenDTO } from '../../dtos/refreshToken.dto';
import { AppRegisterDTO } from '../../dtos/register.dto';
import { ResetPasswordDTO } from '../../dtos/resetPassword.dto';
import { SendOtpDTO } from '../../dtos/sendOtp.dto';
import { VerifyOtpDTO } from '../../dtos/verifyOtp.dto';
import { VerifyResetPasswordDTO } from '../../dtos/verifyResetPassword.dto';
import { AuthService } from '../../services/auth.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('app/auth')
export class AuthAppController {
  constructor(private readonly service: AuthService) {}

  // @Get('google')
  // async googleAuthRequest(
  //   @Query() query: GoogleAuthRequestDTO,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const authorizationUrl = await this.service.googleAuthRequest(query);
  //   res.redirect(authorizationUrl);
  // }

  // @Get('google-redirect')
  // @UseGuards(GoogleOAuthGuard)
  // async googleAuthRedirect(@Request() req, @Response() res) {
  //   const { user } = req;
  //   const { state } = req.query;
  //   const responseData = await this.service.googleLogin(user, state);
  //   res.redirect(responseData.callBackUrl);
  // }

  // @Post('validate')
  // async validate(@Body() body: ValidateDTO): Promise<SuccessResponse<ILginResponse>> {
  //   return this.service.validate(body);
  // }

  // @Post('2fa/turn-on')
  // // @UseGuards(AuthGuard(JWT_STRATEGY))
  // @UseInterceptors(ResponseInterceptor)
  // async turnOn2fa(@AuthUser() authUser: IAuthUser): Promise<SuccessResponse> {
  //   return this.service.turnOn2fa(authUser);
  // }

  // @Post('2fa/turn-off')
  // // @UseGuards(AuthGuard(JWT_STRATEGY))
  // @UseInterceptors(ResponseInterceptor)
  // async turnOff2fa(@AuthUser() authUser: IAuthUser): Promise<SuccessResponse> {
  //   return this.service.turnOff2fa(authUser);
  // }

  // @Post('2fa/authenticate')
  // // @UseGuards(AuthGuard(JWT_STRATEGY))
  // @UseInterceptors(ResponseInterceptor)
  // async authenticate2fa(@Body() body: Authenticate2faDTO): Promise<SuccessResponse<ILginResponse>> {
  //   return this.service.authenticate2fa(body);
  // }

  @Public()
  @Post('login')
  async loginUser(@Body() body: LoginDTO): Promise<SuccessResponse> {
    return this.service.loginUser(body);
  }

  @Public()
  @Post('register')
  async registerUser(@Body() body: AppRegisterDTO): Promise<SuccessResponse> {
    return this.service.registerUser({
      ...body,
      role: ENUM_ACL_DEFAULT_ROLES.WORKER,
    });
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDTO): Promise<SuccessResponse<ILginResponse>> {
    return this.service.refreshToken(body);
  }

  @Public()
  @Post('otp-send')
  async sendB2bUserOtp(@Body() body: SendOtpDTO): Promise<SuccessResponse> {
    return this.service.sendOtp(body);
  }

  @Public()
  @Post('otp-verify')
  async verifyOtp(@Body() body: VerifyOtpDTO): Promise<SuccessResponse<ILginResponse>> {
    return this.service.verifyOtp(body);
  }

  @Public()
  @Post('reset-password-request')
  async resetPassword(@Body() body: ResetPasswordDTO): Promise<SuccessResponse> {
    return this.service.resetPassword(body);
  }

  @Public()
  @Post('reset-password-verify')
  async verifyPassword(
    @Body() body: VerifyResetPasswordDTO,
  ): Promise<SuccessResponse<ILginResponse>> {
    return this.service.verifyResetPassword(body);
  }

  @Patch('change-password')
  async changePassword(
    @Body() body: ChangePasswordDTO,
    @AuthUser() authUser: IAuthUser,
  ): Promise<SuccessResponse<ILginResponse>> {
    return this.service.changePassword(body, authUser);
  }
}
