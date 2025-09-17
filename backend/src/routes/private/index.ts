import { Router } from "express";
import authRouter from "./auth.routes";
import { passportAuthenticateJwt } from "../../config/passport.config";
import fileRouter from "./file.routes";
import analyticsRouter from "./analytics.route";
import apikeyRouter from "./apiKey.route";

const privateRoutes = Router();

privateRoutes.use('/auth',authRouter);
privateRoutes.use('/files', passportAuthenticateJwt, fileRouter);
privateRoutes.use('/analytics', passportAuthenticateJwt, analyticsRouter);
privateRoutes.use('/api-keys', passportAuthenticateJwt,apikeyRouter);
export default privateRoutes;