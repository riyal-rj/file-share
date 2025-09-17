import Router from "express";
import { getUserAnalyticsChartController } from "../../controllers/analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get('/user',getUserAnalyticsChartController);

export default analyticsRouter;