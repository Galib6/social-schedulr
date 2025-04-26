import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'body-parser';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { ENV } from './env';
import { createLogger } from './logger';
import { setupSecurity } from './security';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   logger: ENV.isProduction ? createLogger() : ['error', 'warn', 'debug', 'log', 'verbose'],
  // });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createLogger(),
  });

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));

  app.setViewEngine('hbs');

  app.use(urlencoded({ extended: true }));
  app.use(
    json({
      limit: '10mb',
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  app.setGlobalPrefix(ENV.api.API_PREFIX);

  setupSecurity(app);
  setupSwagger(app);

  await app.listen(ENV.port);
  console.warn(
    `\n\nWAGE API ===>>\n\nNODE_VERSION: v22.12.0\nNODE_ENV: ${ENV.env}\nRUNNING_ON: ${await app.getUrl()}\nAPI_DOCUMENTATION: ${await app.getUrl()}/docs\n\n`,
  );
}
bootstrap();
