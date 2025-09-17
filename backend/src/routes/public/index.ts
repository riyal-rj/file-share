import { Router } from "express";
import { publicGetFileUrlController } from "../../controllers/file.controller";
import { ENV_VARS } from "../../config/env.config";
import v1Routes from "./v";

const publicRouter = Router();

publicRouter.use(`${ENV_VARS.BASE_PATH}/v1`, v1Routes);
publicRouter.get(
    "/file/:fileId",
    publicGetFileUrlController
);
export default publicRouter;