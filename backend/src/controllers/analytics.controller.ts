import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { getUserAnalyticsChartService } from "../services/analytics.service";

export const getUserAnalyticsChartController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { from, to } = req.query;
    const filter = {
      dateFrom: from ? new Date(from as string) : undefined,
      dateTo: to ? new Date(to as string) : undefined,
    };
    const result = await getUserAnalyticsChartService(userId, filter);
    return res.status(HTTP_STATUS.OK).json({
      message: "Analytics fetched successfully",
      ...result,
    });
  }
);
