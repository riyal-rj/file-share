import { Router } from "express";
import { multiUpload } from "./../../config/multer.config";
import { CheckStorageAvailability } from "../../middleware/checkStorage.middleware";
import {
  deleteFilesController,
  downloadFilesController,
  getAllFilesController,
  uploadFilesViaWebController,
} from "../../controllers/file.controller";

const fileRouter = Router();

fileRouter.post(
  "/upload",
  multiUpload,
  CheckStorageAvailability,
  uploadFilesViaWebController
);

fileRouter.post("/download", downloadFilesController);

fileRouter.get("/all", getAllFilesController);
fileRouter.delete("/bulk-delete", deleteFilesController);

export default fileRouter;
