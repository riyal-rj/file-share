import winston, { http, verbose } from "winston";
import { LogtailTransport } from "@logtail/winston";
import { ENV_VARS } from "../config/env.config";
import { logtail } from "../config/logtail.config";

const { combine, colorize, timestamp, errors, json, printf } = winston.format;

const transports: winston.transport[] = [];

if (ENV_VARS.NODE_ENV === "production")
  transports.push(new LogtailTransport(logtail));

if (ENV_VARS.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors(),
        printf(({ level, message, stack, timestamp, ...meta }) => {
          return `${timestamp} [${level?.toUpperCase()}]: ${message} ${
            stack ? stack : ""
          }${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
        }),
        colorize({
          all: true,
          colors: {
            info: "blue",
            error: "red",
            warn: "yellow",
            debug: "green",
            verbose: "gray",
            http: "magenta",
          },
        })
      ),
    })
  );
}

const logger = winston.createLogger({
  level: ENV_VARS.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: transports,
  silent: ENV_VARS.NODE_ENV === "test",
});

export { logger };
