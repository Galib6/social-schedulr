import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@src/app/interceptors';
import { SuccessResponse } from '@src/app/types';
import { ENUM_ACL_DEFAULT_ROLES } from '@src/shared';
import { FindOptionsRelations } from 'typeorm';
import {
  CreateRoleDTO,
  FilterPermissionDTO,
  FilterRoleDTO,
  RemovePermissionsDTO,
  UpdateRoleDTO,
} from '../../dtos';
import { AddPermissionsDTO } from '../../dtos/role/addPermissions.dto';
import { Permission } from '../../entities/permission.entity';
import { Role } from '../../entities/role.entity';
import { RoleService } from '../../services/role.service';

@ApiTags('RBAC#Role')
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@Controller('internal/roles')
export class InternalRoleController {
  constructor(private readonly service: RoleService) {}
  RELATIONS: FindOptionsRelations<Role> = {};

  @Get()
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async findAll(@Query() query: FilterRoleDTO): Promise<SuccessResponse<Role[]>> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id/available-permissions')
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async availablePermissions(
    @Param('id') id: string,
    @Query() query: FilterPermissionDTO,
  ): Promise<Permission[]> {
    return this.service.availablePermissions(id, query);
  }

  @Get(':id')
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async findById(@Param('id') id: string): Promise<Role> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async createOne(@Body() body: CreateRoleDTO): Promise<Role> {
    const isExist = await this.service.findOneBase({ title: body.title });
    if (isExist) throw new ConflictException(`Role ${isExist.title} already exists!`);
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Post(':id/add-permissions')
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async addPermission(
    @Param('id') id: string,
    @Body() body: AddPermissionsDTO,
  ): Promise<Permission[]> {
    return this.service.addPermissions(id, body);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async updateOne(@Param('id') id: string, @Body() body: UpdateRoleDTO): Promise<Role> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    const isExist = await this.service.findByIdBase(id);
    if (Object.values(ENUM_ACL_DEFAULT_ROLES).includes(isExist.title as any))
      throw new ForbiddenException(`Can not delete default role ${isExist.title}!`);
    return this.service.deleteOneBase(id);
  }

  @Delete(':id/remove-permissions')
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  async removePermission(
    @Param('id') id: string,
    @Body() body: RemovePermissionsDTO,
  ): Promise<Permission[]> {
    return this.service.removePermissions(id, body);
  }
}
