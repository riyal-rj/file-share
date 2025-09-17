import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";
import { KEY_TYPE, KeyType } from "./../utils/keys";
import ApiKeyModel from "../models/api.models";
import { logger } from "../utils/logger";
import { findByIdUserService } from "../services/user.service";

export const apiKeyAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "API key required. Use Authoriation Bearer <API_KEY>"
      );
    }

    const apiKey = authHeader.slice(7).trim();
    if (!apiKey) throw new UnauthorizedException("API key missing");

    if (!apiKey.startsWith("sk_") || apiKey.length < 20) {
      logger.error("Invalid Api key format");
      throw new UnauthorizedException("Invalid Api key format");
    }

    const parts = apiKey.split("_");
    if (parts.length < 3 || parts[0] !== "sk") {
        logger.error("Invalid Api key format")
      throw new UnauthorizedException("Invalid Api key format");
    }

    const keyType = parts[1]; // 'live'

    if (!Object.values(KEY_TYPE).includes(keyType as KeyType)) {
        logger.error("Invalid Api key type");
      throw new UnauthorizedException("Invalid Api key type");
    }

    const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");

    const apiKeyDoc = await ApiKeyModel.findOne({
      hashedKey,
    })
      .select("+hashedKey")
      .lean();

    if (!apiKeyDoc) {
      logger.warn("API Key not found");
      throw new UnauthorizedException("Invalid API key");
    }

    const user = await findByIdUserService(apiKeyDoc.userId.toString());

    if (!user) {
      throw new UnauthorizedException("User not found for this API key");
    }

    ApiKeyModel.updateLastUsed(hashedKey).catch(logger.error);

    req.user = user;

    logger.info("API KEY Used", apiKeyDoc.displayKey);

    next();
  } catch (error) {
    next(error);
  }
};
