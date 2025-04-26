import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { asyncForEach } from '@src/shared';
import {
  commitTransaction,
  rollbackTransaction,
  startTransaction,
} from '@src/shared/utils/dborm.utils';
import { DataSource, In, Repository } from 'typeorm';
import { FilterPermissionDTO, RemovePermissionsDTO } from '../dtos';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { AddPermissionsDTO } from './../dtos/role/addPermissions.dto';
import { RolePermission } from './../entities/rolePermission.entity';
import { PermissionService } from './permission.service';
import { RolePermissionService } from './rolePermission.service';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly _repo: Repository<Role>,
    private readonly dataSource: DataSource,
    private readonly rolePermissionService: RolePermissionService,
    private readonly permissionService: PermissionService,
  ) {
    super(_repo);
  }

  async findOrCreateRole(title: string): Promise<Role> {
    const role = await this.findOneBase({ title });
    if (role) return role;
    else return this.createOneBase({ title });
  }

  async availablePermissions(id: string, payload: FilterPermissionDTO): Promise<Permission[]> {
    const isExist = await this.isExist({ id });

    const { data: permissions } = await this.permissionService.findAllBase(payload);

    const rolePermissions = await this.rolePermissionService.find({
      where: {
        role: { id: isExist.id as any },
      },
    });

    if (permissions && permissions.length > 0) {
      permissions.forEach((permission) => {
        const isAlreadyAdded = rolePermissions.find(
          (rolePermission) => rolePermission.permissionId === permission.id,
        );
        permission.isAlreadyAdded = !!isAlreadyAdded;
      });
    }

    return permissions;
  }

  async addPermissions(id: string, payload: AddPermissionsDTO): Promise<Permission[]> {
    const isRoleExist = await this.isExist({ id });

    const addedPermissions: string[] = [];

    const queryRunner = await startTransaction(this.dataSource);

    try {
      payload.permissions = [...new Set(payload.permissions)];

      await asyncForEach(payload.permissions, async (permissionId) => {
        const isRolePermissionExist = await this.rolePermissionService.findOne({
          where: {
            role: { id: isRoleExist.id as any },
            permission: { id: permissionId },
          },
        });

        if (isRolePermissionExist) {
          throw new BadRequestException('Permission already exist');
        }
        await queryRunner.manager.save(
          Object.assign(new RolePermission(), {
            role: isRoleExist.id,
            permission: permissionId,
          }),
        );

        addedPermissions.push(permissionId);
      });

      await commitTransaction(queryRunner);
    } catch (error) {
      await rollbackTransaction(queryRunner);

      throw new BadRequestException(error?.message || 'Something went wrong');
    }

    const permissions = await this.permissionService.find({
      where: {
        id: In(addedPermissions),
      },
    });

    permissions.forEach((permission) => {
      permission.isAlreadyAdded = true;
    });

    return permissions;
  }

  async removePermissions(id: string, payload: RemovePermissionsDTO): Promise<Permission[]> {
    const isRoleExist = await this.isExist({ id });

    const removedPermissions: string[] = [];

    const queryRunner = await startTransaction(this.dataSource);

    try {
      payload.permissions = [...new Set(payload.permissions)];

      await asyncForEach(payload.permissions, async (permissionId) => {
        const isRolePermissionExist = await this.rolePermissionService.findOne({
          where: {
            role: { id: isRoleExist.id as any },
            permission: { id: permissionId },
          },
        });

        if (!isRolePermissionExist) {
          throw new BadRequestException('Permission does not exist');
        }
        await queryRunner.manager.delete(RolePermission, {
          role: isRoleExist.id,
          permission: permissionId,
        });

        removedPermissions.push(permissionId);
      });

      await commitTransaction(queryRunner);
    } catch (error) {
      await rollbackTransaction(queryRunner);

      throw new BadRequestException(error?.message || 'Something went wrong');
    }

    const permissions = await this.permissionService.find({
      where: {
        id: In(removedPermissions),
      },
    });

    permissions.forEach((permission) => {
      permission.isAlreadyAdded = false;
    });

    return permissions;
  }
}
