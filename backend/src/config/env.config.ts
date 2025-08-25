import { getEnvVars } from "../utils/getEnv";

const envConfig = () => ({
  NODE_ENV: getEnvVars('NODE_ENV', 'development'),
  PORT: getEnvVars('PORT', '3000'),

  BASE_PATH: getEnvVars('BASE_PATH', '/api'),
  MONGO_URI: getEnvVars('MONGO_URI', ''),

  JWT_SECRET: getEnvVars('JWT_SECRET', 'secert_jwt'),
  JWT_EXPIRES_IN: getEnvVars('JWT_EXPIRES_IN', '1d'),

  LOG_LEVEL: getEnvVars('LOG_LEVEL', 'info'),

  AWS_ACCESS_KEY: getEnvVars('AWS_ACCESS_KEY'),
  AWS_SECRET_KEY: getEnvVars('AWS_SECRET_KEY'),
  AWS_REGION: getEnvVars('AWS_REGION'),
  AWS_S3_BUCKET: getEnvVars('AWS_S3_BUCKET'),

  LOGTAIL_SOURCE_TOKEN: getEnvVars('LOGTAIL_SOURCE_TOKEN'),
  LOGTAIL_INGESTING_HOST: getEnvVars('LOGTAIL_INGESTING_HOST'),
  
});

export const ENV_VARS=envConfig();