import { Router } from "express";
import authRouter from "./auth.routes";
import { passportAuthenticateJwt } from "../../config/passport.config";
import fileRouter from "./file.routes";

const privateRoutes = Router();

privateRoutes.use('/auth',authRouter);
privateRoutes.use('/files', passportAuthenticateJwt, fileRouter);
export default privateRoutes;