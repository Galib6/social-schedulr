import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Role } from '../../acl/entities/role.entity';
import { User } from './user.entity';

@Entity(ENUM_TABLE_NAMES.USER_ROLES, { orderBy: { createdAt: 'DESC' } })
export class UserRole extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @Type(() => Role)
  role?: Role;

  @RelationId((e: UserRole) => e.role)
  @Column({ nullable: false })
  roleId?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Type(() => User)
  user?: User;

  @RelationId((e: UserRole) => e.user)
  @Column({ nullable: false })
  userId?: string;
}
