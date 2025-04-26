import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AclModule } from './../acl/acl.module';
import { UserModule } from './../user/user.module';
import { AuthAppController } from './controllers/app/auth.app.controller';
import { AuthEmployerController } from './controllers/employer/auth.employer.controller';
import { AuthInternalController } from './controllers/internal/auth.internal.controller';
import { AuthService } from './services/auth.service';

const entities = [];
const services = [AuthService];
const subscribers = [];
const controllers = [];
const appControllers = [AuthAppController];
const employerControllers = [AuthEmployerController];
const internalControllers = [AuthInternalController];
const modules = [UserModule, AclModule, HttpModule];
// const strategies = [LocalStrategy, GoogleStrategy];
const strategies = [];
const guards = [];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services, ...subscribers, ...strategies, ...guards],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...internalControllers, ...appControllers, ...employerControllers],
})
export class AuthModule {}
