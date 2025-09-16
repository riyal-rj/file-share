import { Router } from "express";
import authRouter from "./auth.routes";

const privateRoutes = Router();

privateRoutes.use('/auth',authRouter);

export default privateRoutes;