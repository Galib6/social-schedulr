import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from '@src/app/helpers/helpers.module';
import { AclModule } from '../acl/acl.module';
import { GlobalConfigModule } from '../globalConfig/globalConfig.module';
import { InternalUserController } from './controllers/internal/user.internal.controller';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRole } from './entities/userRole.entity';
import { UserService } from './services/user.service';
import { UserRoleService } from './services/userRole.service';
import { UserSubscriber } from './subscribers/user.subscriber';

const entities = [User, UserRole];
const services = [UserService, UserRoleService];
const subscribers = [UserSubscriber];
const controllers = [UserController];
const internalControllers = [InternalUserController];
const modules = [HelpersModule, AclModule, GlobalConfigModule];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...internalControllers],
})
export class UserModule {}
