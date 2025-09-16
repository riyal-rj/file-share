import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { UploadSourceEnum } from "../enum/uploadSource.enum";
import { HTTP_STATUS } from "../config/http.config";
import {
  uploadFileService,
  getAllFileService,
  deleteFileService,
  downloadFilesService,
  getFileUrlService,
} from "../services/file.service";
import { deleteFileSchema, downloadFileSchema, fileIdSchema } from "../validators/files.validators";

export const uploadFilesViaWebController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const files = req.files as Express.Multer.File[];
    const uploadVia = UploadSourceEnum.WEB;

    const results = await uploadFileService(userId, files, uploadVia);

    return res.status(HTTP_STATUS.OK).json(results);
  }
);

export const uplaodFileViaApiControllers = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const files = req.files as Express.Multer.File[];
    const uploadedVia = UploadSourceEnum.API;

    const results = await uploadFileService(userId, files, uploadedVia);

    return res.status(HTTP_STATUS.OK).json(results);
  }
);

export const getAllFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const filter = {
      keyword: req.query.keyword as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 20,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const result = await getAllFileService(userId, filter, pagination);

    return res.status(HTTP_STATUS.OK).json({
      message: "All files fetched successfully",
      ...result,
    });
  }
);

export const deleteFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { fileIds } = deleteFileSchema.parse(req.body);

    const result = await deleteFileService(userId, fileIds);

    return res.status(HTTP_STATUS.OK).json({
      message: "Files deleted successfully",
      ...result,
    });
  }
);


export const downloadFilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { fileIds } = downloadFileSchema.parse(req.body);

    const result = await downloadFilesService(userId, fileIds);

    return res.status(HTTP_STATUS.OK).json({
      message: 'File download URL successfully',
      downloadUrl: result?.url,
      isZip: result?.isZip || false,
    });
  },
);

export const publicGetFileUrlController = asyncHandler(
  async (req: Request, res: Response) => {
    const fileId = fileIdSchema.parse(req.params.fileId);
    const { url, stream, contentType, fileSize } =
      await getFileUrlService(fileId);

    res.set({
      'Content-Type': contentType,
      'Content-Length': fileSize,
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
    });

    stream.pipe(res);
  },
);
