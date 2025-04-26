import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ENV } from './env';

const allowedOrigins = ENV.security.CORS_ALLOWED_ORIGINS;

export function setupSecurity(app: INestApplication): void {
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error(`Request origin ${origin} not allowed by CORS`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
}
