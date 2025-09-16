import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import { HTTP_STATUS } from "../config/http.config";
import { loginService, registerService } from "../services/auth.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    await registerService(body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const result = await loginService(body);

    return res.status(HTTP_STATUS.OK).json({
      message: "User logged in successfully",
      ...result,
    });
  }
);
