import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@src/database/database.module';
import { AppController } from './app.controller';
import { ExceptionFilter } from './filters';
import { GuardsModule } from './guards/gaurds.module';
import { HelpersModule } from './helpers/helpers.module';
import { GlobalRequestInterceptor, ResponseInterceptor } from './interceptors';
import { AntiBotMiddleware } from './middlewares/antibotMiddleware';
import { AclModule } from './modules/acl/acl.module';
import { AuthModule } from './modules/auth/auth.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { UserModule } from './modules/user/user.module';
import { UniqueValidatorPipe } from './pipes/uniqueValidator.pipe';

const MODULES = [
  DatabaseModule,
  HelpersModule,
  ScheduleModule.forRoot(),
  AuthModule,
  GalleryModule,
  AclModule,
  UserModule,
  GuardsModule,
];
const PIPES = [UniqueValidatorPipe];

@Module({
  imports: [...MODULES],
  controllers: [AppController],
  providers: [
    ...PIPES,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalRequestInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AntiBotMiddleware).forRoutes('*');
  }
}
