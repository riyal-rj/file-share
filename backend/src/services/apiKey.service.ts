import ApiKeyModel from "../models/api.models";
import { NotFoundException } from "../utils/appError";
import { generatedAPIKey } from "../utils/keys";

export const createApiKeyService = async (userId: string, name: string) => {
  const { rawKey, hashedKey, displayKey } = generatedAPIKey();

  const apiKey = new ApiKeyModel({
    userId,
    name,
    hashedKey,
    displayKey,
  });

  await apiKey.save();

  return {
    rawKey,
  };
};

export const getAllApiKeysService = async (
  userId: string,
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const { pageSize, pageNumber } = pagination;

  const skip = (pageNumber - 1) * pageSize;

  const [apiKeys, totalCount] = await Promise.all([
    ApiKeyModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    ApiKeyModel.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    apiKeys,
    pagination: {
      pageSize,
      pageNumber,
      totalPages,
      totalCount,
      skip,
    },
  };
};

export const deleteApiKeyService = async (userId: string, apiKeyId: string) => {
  const result = await ApiKeyModel.deleteOne({
    _id: apiKeyId,
    userId,
  });
  if (result.deletedCount === 0)
    throw new NotFoundException("API key not found");

  return {
    message: "API key deleted successfully",
    deletedCount: result.deletedCount,
  };
};
