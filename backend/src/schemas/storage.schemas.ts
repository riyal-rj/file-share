import { Model, TypeKeyBaseType, Types } from "mongoose";

interface Storage{
    userId:Types.ObjectId,
    storageQuota:number,
    createdAt:Date,
    updatedAt:Date
}

interface StorgaeMetric{
   quota: number,
   usage: number,
   remaining: number
}

interface UploadValidation{
    allowed: boolean,
    newUsage: number,
    remainingAfterUpload: number
}

interface StorageStaticsInterface{
    getStorageMetrics(userId: Types.ObjectId): Promise<StorgaeMetric>;
    validateUpload(
        userId:Types.ObjectId,
        fileSize:number
    ):Promise<UploadValidation>
}

export interface StorageInterface extends Storage, Document{}

export interface StorageModelType extends Model<StorageInterface>,StorageStaticsInterface{}