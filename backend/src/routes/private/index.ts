import { Router } from "express";
import authRouter from "./auth.routes";
import { passportAuthenticateJwt } from "../../config/passport.config";
import fileRouter from "./file.routes";
import analyticsRouter from "./analytics.route";

const privateRoutes = Router();

privateRoutes.use('/auth',authRouter);
privateRoutes.use('/files', passportAuthenticateJwt, fileRouter);
privateRoutes.use('/analytics', passportAuthenticateJwt, analyticsRouter);
export default privateRoutes;