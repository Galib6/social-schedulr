import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base/base.service';
import { asyncForEach, ENUM_ACL_DEFAULT_ROLES } from '@src/shared';
import {
  commitTransaction,
  rollbackTransaction,
  startTransaction,
} from '@src/shared/utils/dborm.utils';
import { isNotEmptyObject } from 'class-validator';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { FilterRoleDTO } from '../../acl/dtos';
import { RoleService } from '../../acl/services/role.service';
import { CreateUserDTO, UpdateRolesDTO, UpdateUserDTO } from '../dtos';
import { User } from '../entities/user.entity';
import { UserRole } from './../entities/userRole.entity';
import { UserRoleService } from './userRole.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly _repo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
  ) {
    super(_repo);
  }

  async availableRoles(id: string | string, payload: FilterRoleDTO): Promise<any> {
    const isExist = await this.isExist({ id: id });

    const { data: roles } = await this.roleService.findAllBase(payload);

    const userRoles = await this.userRoleService.find({
      where: {
        userId: isExist.id,
      },
    });

    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        const isAlreadyAdded = userRoles.find((userRole) => userRole.roleId === role.id);
        role.isAlreadyAdded = !!isAlreadyAdded;
      });
    }

    return roles;
  }

  async createUser(payload: CreateUserDTO, relations?: FindOptionsRelations<User>): Promise<User> {
    const { roles, ...restPayload } = payload;

    const queryRunner = await startTransaction(this.dataSource);

    let createdUser = null;

    try {
      createdUser = await queryRunner.manager.save(User, restPayload);

      if (!createdUser) {
        throw new BadRequestException('User not created');
      }
      const roleData = await this.roleService.findOrCreateRole(roles[0]);
      await queryRunner.manager.save(
        Object.assign(new UserRole(), {
          userId: createdUser.id,
          roleId: roleData.id,
        }),
      );
      await commitTransaction(queryRunner);
    } catch (error) {
      await rollbackTransaction(queryRunner);

      throw new BadRequestException(error.message || 'User not created');
    }

    if (!createdUser) {
      throw new BadRequestException('User not created');
    }

    const updatedUser = await this.findOne({
      where: {
        id: createdUser.id,
      },
      relations,
    });

    return updatedUser;
  }

  async updateUser(
    id: string | string,
    payload: UpdateUserDTO,
    relations: FindOptionsRelations<User>,
  ): Promise<User> {
    await this.isExist({ id: id as any });

    const { roles, ...userData } = payload;

    const queryRunner = await startTransaction(this.dataSource);

    try {
      if (isNotEmptyObject(userData)) {
        await queryRunner.manager.update(User, { id }, userData);
      }

      if (roles && roles.length > 0) {
        const deletedItems = roles.filter((role) => role.isDeleted);
        const newOrUpdatedItems = roles.filter((role) => !role.isDeleted);

        await asyncForEach(deletedItems, async (role: UpdateRolesDTO) => {
          await this.userRoleService.isExist({
            userId: id,
            roleId: role.role,
          });
          await queryRunner.manager.delete(UserRole, {
            userId: id,
            roleId: role.role,
          });
        });

        await asyncForEach(newOrUpdatedItems, async (role: UpdateRolesDTO) => {
          const isRoleExist = await this.roleService.isExist({
            id: role.role,
          });
          const isUserRoleExist = await this.userRoleService.findOne({
            where: {
              userId: id,
              roleId: role.role,
            },
          });

          if (isUserRoleExist)
            throw new ConflictException(`User already has the ${isRoleExist?.title} role!`);
          else {
            await queryRunner.manager.save(
              Object.assign(new UserRole(), {
                userId: id,
                roleId: role.role,
              }),
            );
          }
        });
      }

      await commitTransaction(queryRunner);
    } catch (error) {
      await rollbackTransaction(queryRunner);

      throw new BadRequestException(error.message || 'User not updated');
    }

    const updatedUser = await this.findOne({
      where: { id: id },
      relations,
    });

    return updatedUser;
  }

  async findOrCreateByPhoneNumber(phoneNumber: string): Promise<User> {
    const role = await this.roleService.findOneBase({
      title: ENUM_ACL_DEFAULT_ROLES.WORKER,
    });
    const isExist = await this.findOneBase({ phoneNumber });

    if (isExist) {
      return isExist;
    } else {
      const user = await this.createOneBase({
        phoneNumber,
      });

      await this.userRoleService.createOneBase({
        userId: user.id,
        roleId: role.id,
      });
      return user;
    }
  }
}
