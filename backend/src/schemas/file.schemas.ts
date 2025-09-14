import { Model, Types } from "mongoose";
import { UploadSourceEnum } from "../enum/uploadSource.enum";

export interface FileInterface extends Document{
    userId:Types.ObjectId,
    originalName:string,
    fileName:string,
    storageKey:string,
    mimeTypes:string,
    size:number,
    formattedSize:string,
    ext:string,
    uploadVia: keyof typeof UploadSourceEnum,
    url:string,
    createdAt:Date,
    updatedAt:Date
}

export interface FileModelType extends Model<FileInterface>{
    calculateUsage(userId:Types.ObjectId):Promise<number>
}