import 'dotenv/config';

export type ConfigMapType = {
  [name: string]: () => IConfig;
};

export const isRunTimeDev: boolean = process.env.RUNTIME_ENV !== 'prod';

export interface IConfig {
  name: string;
  port: number;
  secret: string;
  jwtSecret: string;
  isLocal?: boolean;
  httpTimeout: number;
  isTesting?: boolean;
  jwtExpInDays: string;
  encryptionKey: string;
  regenerateForgotPasswordWaitSeconds: number;
  isProduction?: boolean;
  isDevelopment?: boolean;
  routePathPrefix: string;
  nodemailer: {
    hostMailAddress?: string;
    host: string;
    port: number;
    secure: boolean; // true for 465, false for other ports
    auth: {
      user: string; // generated ethereal user
      pass: string; // generated ethereal password
    };
  };
  mongodb: {
    uri: string;
    poolSize: number;
  };
  providers?: Record<string, unknown | any>;
}

const nodeEnv: string = process.env.NODE_ENV ?? 'development';
const appName: string = process.env.APP_NAME ?? 'backend';

const development: any = (): IConfig => {
  return {
    isLocal: false,
    isTesting: false,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    name: appName,
    jwtExpInDays: process.env.JWT_EXP_IN_DAYS ?? '365',
    jwtSecret: process.env.JWT_SECRET || '123sfdrqw12313SD123',
    routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? '/api/',
    port: parseInt(process.env.PORT ?? '0'),
    regenerateForgotPasswordWaitSeconds:
      parseInt(process.env.REGENERATE_FORGOT_PASSWORD_WAIT_SECONDS) || 300,
    mongodb: {
      poolSize: parseInt(process.env.MONGODB_DB_POOL_SIZE) ?? 10,
      uri: process.env.MONGODB_URI ?? 'mongodb://0.0.0.0:27017/backend-test',
    },
    nodemailer: {
      hostMailAddress: process.env.SMTP_HOST_MAIL || '',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'supe12.io',
        pass: process.env.SMTP_PASS || 'iwjubxdfvo12tgllrx',
      },
    },
    secret: process.env.SECRET ?? '@QEGTUI',
    encryptionKey: process.env.ENCRYPTION_KEY ?? '',
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) ?? 10000,
  };
};

const production: any = (): IConfig => {
  return {
    isTesting: false,
    isLocal: false,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    name: appName,
    jwtExpInDays: process.env.JWT_EXP_IN_DAYS ?? '7',
    jwtSecret: process.env.JWT_SECRET || '$ecret',
    routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? '/api/',
    port: parseInt(process.env.PORT || '0') ?? 0,
    regenerateForgotPasswordWaitSeconds:
      parseInt(process.env.REGENERATE_FORGOT_PASSWORD_WAIT_SECONDS) || 300,
    mongodb: {
      poolSize: parseInt(process.env.MONGODB_DB_POOL_SIZE) ?? 10,
      uri: process.env.MONGODB_URI ?? 'mongodb://0.0.0.0:27017/backend-prod',
    },
    nodemailer: {
      hostMailAddress: process.env.SMTP_HOST_MAIL || '',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    secret: process.env.SECRET ?? '@QEGTUI',
    encryptionKey: process.env.ENCRYPTION_KEY ?? 'asdfs2323sdf23342dfsf32434',
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) ?? 10000,
  };
};

const test: any = (): IConfig => {
  return {
    isTesting: true,
    isLocal: false,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    name: appName,
    jwtExpInDays: process.env.JWT_EXP_IN_DAYS ?? '365',
    jwtSecret: process.env.JWT_SECRET || 'asdfasfsafdfasdfasf',
    routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? '/api/',
    regenerateForgotPasswordWaitSeconds:
      parseInt(process.env.REGENERATE_FORGOT_PASSWORD_WAIT_SECONDS) || 300,
    port: parseInt(process.env.PORT || '0') ?? 0,
    nodemailer: {
      hostMailAddress: process.env.SMTP_HOST_MAIL || '',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    mongodb: {
      poolSize: parseInt(process.env.MONGODB_DB_POOL_SIZE) ?? 10,
      uri: process.env.MONGODB_URI ?? 'mongodb://0.0.0.0:27017/backend-test',
    },
    secret: process.env.SECRET ?? '@QEGTUI',
    encryptionKey: process.env.ENCRYPTION_KEY ?? 'testtestestestest',
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) ?? 10000,
  };
};

const configMap: ConfigMapType = {
  test,
  development,
  production,
};

export const appConfig: IConfig = configMap[nodeEnv]();

const appNamePortSum: any = (): number => {
  return (
    Math.ceil(
      [...appConfig.name, ...appConfig.name.split('-').pop()].reduce(
        (sum: any, char: any): number => sum + char.charCodeAt(0),
        0,
      ) / 30,
    ) + 3010
  );
};

// tslint:disable-next-line:no-typeof-undefined
appConfig.port = typeof process.env.PORT == 'undefined' ? appNamePortSum() : appConfig.port;
