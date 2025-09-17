import { UploadSourceEnum } from "../enum/uploadSource.enum";
import FileModel from "../models/file.models";
import UserModel from "../models/user.models";
import { BadRequestException, InternalServerError, NotFoundException, UnauthorizedException } from "../utils/appError";
import archiver from "archiver";
import { Readable, PassThrough } from "stream";
import path from "path";
import { logger } from "../utils/logger";
import { sanitizeFilename } from "../utils/helper";
import { v4 as uuidv4 } from "uuid";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { ENV_VARS } from "../config/env.config";
import { s3Client } from "../config/aws-s3.config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
export const uploadFileService = async (
  userId: string,
  files: Express.Multer.File[],
  uploadedVia: UploadSourceEnum
) => {
  const user = await UserModel.findOne({ _id: userId });
  if (!user) throw new UnauthorizedException("Unauthorized access");

  if (!files?.length) throw new BadRequestException("No files provided");

  const results = await Promise.allSettled(
    files.map(async (file) => {
      let _storageKey: string | null = null;
      try {
        const { storageKey } = await uploadTOS3(file, userId);
        _storageKey = storageKey;
        const createdFile = await FileModel.create({
          userId,
          originalName: file.originalname,
          storageKey,
          uploadVia: uploadedVia,
          size: file.size,
          ext: path.extname(file.originalname)?.slice(1)?.toLowerCase(),
          url: "",
          mimeTypes: file.mimetype,
        });

        return {
          fileId: createdFile._id,
          originalName: createdFile.originalName,
          size: createdFile.size,
          ext: createdFile.ext,
          mimeType: createdFile.mimeTypes,
        };
      } catch (error) {
        logger.error(`Error while uploading file`, error);
        if (_storageKey) {
          await deleteFromS3(_storageKey);
        }
        throw error;
      }
    })
  );
};

export const getAllFileService = async (
  userId: string,
  filter: {
    keyword?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const { keyword } = filter;
  const filterConditions: Record<string, any> = {
    userId,
  };

  if (keyword) {
    filterConditions.$or = [
      {
        originalName: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [files, totalCount] = await Promise.all([
    FileModel.find(filterConditions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    FileModel.countDocuments(filterConditions),
  ]);

  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const url = await getFileFromS3({
        storageKey: file.storageKey,
        mimeType: file.mimeTypes,
        expiresIn: 3600,
      });
      return {
        ...file.toObject(),
        url,
        storageKey: undefined,
      };
    })
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    files: filesWithUrls,
    pagination: {
      pageSize,
      pageNumber,
      totalPages,
      totalCount,
      skip,
    },
  };
};


export const getFileUrlService= async(fileId:string)=>{
  const file = await FileModel.findOne({_id:fileId});
  if(!file)
    throw new NotFoundException('File not found');
  const stream = await getS3ReadStream(file.storageKey);

  return{
    url:'',
    stream,
    contentType: file.mimeTypes,
    fileSize:file.size
  }
};

export const deleteFileService = async(userId:string, fileIds: string []) =>{
  const files = await FileModel.find({
    _id:{$in: fileIds},
  });

  if(!files.length)
    throw new NotFoundException('No files found');

  const s3Errors: string []=[];

  await Promise.all(
    files.map(async(file)=>{
      try {
        await deleteFromS3(file.storageKey);
      } catch (error) {
        logger.error(`Error while deleting file from S3`, error);
        s3Errors.push(file.storageKey);
      }
    })
  );

  const successfulFileIds = files.filter((file)=> !s3Errors.includes(file.storageKey))
  .map((file)=>file._id);

  const {deletedCount} = await FileModel.deleteMany({
    _id:{$in:successfulFileIds},
    userId
  });

  if(s3Errors.length > 0)
    logger.warn(`Failed to delete ${s3Errors.length} files from S3`);

  return {
    deletedCount,
    failedCount: s3Errors.length
  }
}


export const downloadFilesService = async (
  userId: string,
  fileIds: string[]
) => {
  const files = await FileModel.find({
    _id: { $in: fileIds },
  });
  if (!files.length) throw new NotFoundException("No files found");

  if(files.length === 1){
    const signedUrl = await getFileFromS3({
      storageKey: files[0].storageKey,
      mimeType: files[0].mimeTypes,
    });

    return {
      url: signedUrl,
      isZip: false,
    };
  }

  const url= await handleMultipleFileDownload(files,userId);

  return {
    url,
    isZip: true,
  };
}

async function handleMultipleFileDownload(
  files: Array<{ storageKey: string; originalName: string }>,
  userId: string,
) {
  const timestamp = Date.now();

  const zipKey = `temp-zips/${userId}/${timestamp}.zip`;

  const zipFilename = `fileForge-${timestamp}.zip`;

  const zip = archiver('zip', { zlib: { level: 6 } });

  const passThrough = new PassThrough();

  zip.on('error', (err) => {
    passThrough.destroy(err);
  });

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: ENV_VARS.AWS_S3_BUCKET!,
      Key: zipKey,
      Body: passThrough,
      ContentType: 'application/zip',
    },
  });

  zip.pipe(passThrough);

  for (const file of files) {
    try {
      const stream = await getS3ReadStream(file.storageKey);
      zip.append(stream, { name: sanitizeFilename(file.originalName) });
    } catch (error: any) {
      zip.destroy(error);
      throw error;
    }
  }

  await zip.finalize();

  await upload.done();

  const url = await getFileFromS3({
    storageKey: zipKey,
    filename: zipFilename,
    expiresIn: 3600,
  });

  return url;
}


async function uploadTOS3(
  file: Express.Multer.File,
  userId: string,
  meta?: Record<string, string>
) {
  try {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const cleanName = sanitizeFilename(basename).substring(0, 64);
    const storageKey = `users/${userId}/${uuidv4()}-${cleanName}${ext}`;

    const command = new PutObjectCommand({
      Bucket: ENV_VARS.AWS_S3_BUCKET,
      Key: storageKey,
      Body: file.buffer,
      ...(meta && { Metadata: meta }),
    });

    await s3Client.send(command);

    return { storageKey };
  } catch (error) {
    logger.error(`Error while uploading file to S3`, error);
    throw error;
  }
}

async function getFileFromS3({
  storageKey,
  filename,
  mimeType,
  expiresIn = 60,
}: {
  storageKey?: string;
  filename?: string;
  mimeType?: string;
  expiresIn?: number;
}) {
  try {
    const command = new GetObjectCommand({
      Bucket: ENV_VARS.AWS_S3_BUCKET,
      Key: storageKey,
      ...(!filename && {
        ResponseContentType: mimeType,
        ResponseContentDisposition: `inline`,
      }),

      ...(filename && {
        ResponseContentDisposition: `attachment; filename="${filename}"`,
      }),
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    logger.error(`Failed to get file from S3`, error);
    throw error;
  }
}

async function getS3ReadStream(storageKey: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: ENV_VARS.AWS_S3_BUCKET,
      Key: storageKey,
    });
    const response = await s3Client.send(command);
    if (!response.Body) {
      logger.error(`No body returned for key: ${storageKey}`);
      throw new InternalServerError(`No body returned for key: ${storageKey}`);
    }
    return response.Body as Readable;
  } catch (error) {
    logger.error(`Error while getting file from S3`, error);
   throw new InternalServerError(`Failed to retrieve file from S3`)  
  }
}

async function  deleteFromS3(storageKey:string){
  try {
    const command = new DeleteObjectCommand({
      Bucket: ENV_VARS.AWS_S3_BUCKET,
      Key: storageKey,
    });
    await s3Client.send(command);
  } catch (error) {
    logger.error(`Failed to delete file from S3`, storageKey);
    throw error;
  }
}