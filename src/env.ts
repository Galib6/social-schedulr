import { toBool, toNumber } from '@src/shared';
import { config } from 'dotenv';
import * as path from 'path';

config({
  path: path.join(process.cwd(), 'environments', `${process.env.NODE_ENV || 'development'}.env`),
});

export const ENV_DEVELOPMENT = 'development';
export const ENV_PRODUCTION = 'production';
export const ENV_STAGING = 'staging';
export const ENV_QA = 'qa';

export const ENV = {
  port: process.env.PORT,
  env: process.env.NODE_ENV || ENV_DEVELOPMENT,
  isProduction: process.env.NODE_ENV === ENV_PRODUCTION,
  isStaging: process.env.NODE_ENV === ENV_STAGING,
  isTest: process.env.NODE_ENV === ENV_QA,
  isDevelopment: process.env.NODE_ENV === ENV_DEVELOPMENT,

  api: {
    API_PREFIX: process.env.API_PREFIX,
    API_VERSION: process.env.API_VERSION,
    API_TITLE: process.env.API_TITLE,
    API_DESCRIPTION: process.env.API_DESCRIPTION,
  },

  security: {
    CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS?.split(',').map((item) => item?.trim()),
    RATE_LIMIT_TTL: toNumber(process.env.RATE_LIMIT_TTL),
    RATE_LIMIT_MAX: toNumber(process.env.RATE_LIMIT_MAX),
  },

  logger: {
    LOG_FOLDER: process.env.LOG_FOLDER,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    secretForAccountVerification: process.env.JWT_SECRET_FOR_ACCOUNT_VERIFICATION,
    secretForResetPassword: process.env.JWT_SECRET_FOR_RESET_PASSWORD,
    saltRound: toNumber(process.env.JWT_SALT_ROUNDS),
    tokenExpireIn: process.env.JWT_EXPIRES_IN,
    refreshTokenExpireIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },

  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    synchronize: toBool(process.env.DB_SYNCHRONIZE),
    logging: toBool(process.env.DB_LOGGING),
  },

  auth: {
    otpExpireIn: toNumber(process.env.OTP_EXPIRES_IN),
    skipAuth: toBool(process.env.SKIP_AUTH),
  },

  s3: {
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
    folderPrefix: process.env.S3_FOLDER_PREFIX,
  },
  mail: {
    gmail: {
      clientId: '373266192637-l50tghol2up6unt1d8b5g8mp30b6cfbm.apps.googleusercontent.com',
      clientSecret: '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',
      tokens: {
        access_token:
          'ya29.a0AWY7Ckn9zPJ1RvZxbe72RiBHfvptjTJ-nuRNePOw_k_V18wW6YjSRmw33OCnJ62fj1U-0IsAT58oc9A-4bfyB0Vi26iYW2qDZB2MlqC58t46jrSbaxvwwIYsgeE6zZHVr2TFQR21fCeTOB17f0Y5P_-BqvVaaCgYKAW4SARISFQG1tDrpFYMPrbp_lD_aQ5sOdFl8rg0163',
        refresh_token:
          '1//0ggFw4VjyZ05zCgYIARAAGBASNwF-L9IrNfoHWdP_cOLp40nIEQ5m0-qRCqICG75UOgKQBnJCQTEXHGhwwXZpT_jd2EF_YLbiOPM',
        scope: 'https://www.googleapis.com/auth/gmail.send',
        token_type: 'Bearer',
        expiry_date: 1683057125997,
      },
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: toNumber(process.env.SMTP_PORT),
      secure: toBool(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
      },
    },
  },
  defaultEmails: {
    vtsConsultant: process.env.VTS_CONSULTANT_EMAIL,
  },
  seedData: {
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
  },
  sso: {
    webLoginUrl: process.env.SSO_WEB_LOGIN_URL,
  },
  authenticator: {
    google: {
      issuer: process.env.GOOGLE_AUTHENTICATOR_ISSUER,
    },
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL,
  },
  policy: {
    supportEmailAddress: process.env.SUPPORT_EMAIL_ADDRESS,
  },
  //   redis: {
  //     host: process.env.REDIS_HOST,
  //     port: Number(process.env.REDIS_PORT),
  //     password: process.env.REDIS_PASSWORD,
  //   },
};

export const ormConfig = {
  type: ENV.db.type,
  host: ENV.db.host,
  port: +ENV.db.port,
  username: ENV.db.username,
  password: ENV.db.password,
  database: ENV.db.database,
  synchronize: ENV.db.synchronize,
  logging: ENV.db.logging,
  autoLoadEntities: true,
};
