import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ENV } from '@src/env';

@ApiTags('SYSTEM')
@Controller('system')
export class AppController {
  @Get('/health')
  getHealth(): { success: boolean; statusCode: number; message: string; data: string } {
    return {
      success: true,
      statusCode: 200,
      message: 'WAGE HATE API is working',
      data: 'UP',
    };
  }

  @Get('/version')
  getVersion(): { success: boolean; statusCode: number; message: string; data: string } {
    return {
      success: true,
      statusCode: 200,
      message: 'WAGE HATE API is working',
      data: ENV.api.API_VERSION,
    };
  }
}
