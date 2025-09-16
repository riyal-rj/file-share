import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import { ENV_VARS } from "./config/env.config";
import { UnauthorizedException } from "./utils/appError";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { logger } from "./utils/logger";
import { connectDatabase, disconnectDatabase } from "./config/database.config";
import privateRoutes from "./routes/private";
import passport from "passport";

const app = express();
const BASE_PATH = ENV_VARS.BASE_PATH;

const allowedOrigins = ENV_VARS.ALLOWED_ORIGINS?.split(",");

const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else {
      const errorMsg = `CORS error: Origin ${origin} is not allowed`;
      callback(new UnauthorizedException(errorMsg), false);
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(passport.initialize());

app.use(BASE_PATH,privateRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(ENV_VARS.PORT, () => {
      logger.info(
        `Server is running on port ${ENV_VARS.PORT} in ${ENV_VARS.NODE_ENV} mode`
      );
    });

    const shutDownSignals = ["SIGTERM", "SIGINT"];

    shutDownSignals.forEach((signal) => {
      process.on(signal, async () => {
        try {
          logger.warn(`${signal} received: shutting down gracefully`);
          server.close(async () => {
            logger.warn(`HTTP server closed`);
            await disconnectDatabase();
            process.exit(0);
          });
        } catch (error) {
          logger.error(
            `Error occurred while shutting down the server: ${error}`
          );
          process.exit(1);
        }
      });
    });
  } catch (error) {
    logger.error(`Failed to start the server`, error);
    process.exit(1);
  }
}

startServer();
