import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import {
  createApiKeySchema,
  deleteApiKeySchema,
} from "../validators/apiKey.validators";
import {
  createApiKeyService,
  deleteApiKeyService,
  getAllApiKeysService,
} from "./../services/apiKey.service";

export const getAllApiKeysController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 20,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };
    const result = await getAllApiKeysService(userId, pagination);

    return res.status(HTTP_STATUS.OK).json({
      message: "All API keys fetched successfully",
      ...result,
    });
  }
);

export const createApiKeyController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { name } = createApiKeySchema.parse(req.body);

    const { rawKey } = await createApiKeyService(userId, name);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'API key created successfully',
      key: rawKey,
    });
  },
);

export const deleteApiKeyController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { id } = deleteApiKeySchema.parse(req.params);

    const result = await deleteApiKeyService(userId, id);

    return res.status(HTTP_STATUS.OK).json({
      message: 'API key deleted successfully',
      data: result,
    });
  },
);