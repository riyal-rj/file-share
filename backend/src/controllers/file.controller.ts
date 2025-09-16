import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { UploadSourceEnum } from "../enum/uploadSource.enum";
import { HTTP_STATUS } from "../config/http.config";

export const uploadFilesViaWebController = asyncHandler(
    async(req:Request, res:Response) =>{
        const userId = req.user?._id;
        const files = req.files as Express.Multer.File[];
        const uploadVia = UploadSourceEnum.WEB;
        
        //const results = await uploadFile

        //return res.status(HTTP_STATUS.OK).json(results)
    }
)