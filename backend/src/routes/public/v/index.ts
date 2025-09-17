import { Router } from "express";
import fileV1Routes from "./file.route";
import { apiKeyAuthMiddleware } from "../../../middleware/api-Key-auth.middleware";

const v1Routes = Router();

v1Routes.use("/files", apiKeyAuthMiddleware, fileV1Routes);

export default v1Routes;
