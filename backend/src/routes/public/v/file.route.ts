import { Router } from "express";
import { multiUpload } from "../../../config/multer.config";
import { CheckStorageAvailability } from "../../../middleware/checkStorage.middleware";
import {uplaodFileViaApiControllers} from "../../../controllers/file.controller";

const fileRouter = Router();

fileRouter.post(
    "/upload",
    multiUpload,
    CheckStorageAvailability,
    uplaodFileViaApiControllers
);
export default fileRouter;