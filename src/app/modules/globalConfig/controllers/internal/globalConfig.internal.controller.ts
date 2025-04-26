import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindOptionsRelations } from 'typeorm';
import { UpdateGlobalConfigDTO } from '../../dtos/globalConfig/update.dto';
import { GlobalConfig } from '../../entities/globalConfig.entity';
import { GlobalConfigService } from '../../services/globalConfig.service';

@ApiTags('GlobalConfig')
@ApiBearerAuth()
@Controller('internal/global-configs')
export class GlobalConfigInternalController {
  constructor(private readonly service: GlobalConfigService) {}

  RELATIONS: FindOptionsRelations<GlobalConfig> = {};

  @Get()
  async find(): Promise<any> {
    return this.service.getConfig();
  }

  @Patch()
  async updateOne(@Body() body: UpdateGlobalConfigDTO): Promise<any> {
    return await this.service.update(body);
  }
}
