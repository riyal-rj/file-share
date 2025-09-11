import { ErrorRequestHandler, Response } from "express";
import { ZodError } from "zod";
import { HTTP_STATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { logger } from "../utils/logger";
import { ErrorCodeEnum } from "../enum/errorCode.enum";

const formatZodeError = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    message: "Validation Error",
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    errors,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  logger.error(`Error on path : ${req.path}`, {
    body: req.body,
    params: req.params,
    error,
  });

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid json format, please check your requst body",
    });
  }

  if (error instanceof ZodError) {
    return formatZodeError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown Error",
  });
};
