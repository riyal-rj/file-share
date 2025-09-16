import { getEnvVars } from "../utils/getEnv";

const envConfig = () => {
  const username = getEnvVars("MONGODB_USERNAME");
  const password = getEnvVars("MONGODB_PASSWORD");
  const database = getEnvVars("MONGO_DATABASE");

  let mongoUri = getEnvVars("MONGO_URI");

  mongoUri = mongoUri
    .replace("<userName>", encodeURIComponent(username))
    .replace("<password>", encodeURIComponent(password))
    .replace("<database>", database);

  return {
    NODE_ENV: getEnvVars("NODE_ENV", "development"),
    PORT: getEnvVars("PORT", "3000"),

    BASE_PATH: getEnvVars("BASE_PATH", "/api/v1"),
    MONGO_URI: mongoUri,

    JWT_SECRET: getEnvVars("JWT_SECRET", "secret_jwt"),
    JWT_EXPIRES_IN: getEnvVars("JWT_EXPIRES_IN", "1d"),

    LOG_LEVEL: getEnvVars("LOG_LEVEL", "info"),

    AWS_ACCESS_KEY: getEnvVars("AWS_ACCESS_KEY"),
    AWS_SECRET_KEY: getEnvVars("AWS_SECRET_KEY"),
    AWS_REGION: getEnvVars("AWS_REGION"),
    AWS_S3_BUCKET: getEnvVars("AWS_S3_BUCKET"),

    LOGTAIL_SOURCE_TOKEN: getEnvVars("LOGTAIL_SOURCE_TOKEN"),
    LOGTAIL_INGESTING_HOST: getEnvVars("LOGTAIL_INGESTING_HOST"),

    ALLOWED_ORIGINS: getEnvVars("ALLOWED_ORIGINS"),
  };
};

export const ENV_VARS = envConfig();
