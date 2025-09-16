import mongoose, { Schema, Types } from "mongoose";
import { StorageInterface, StorageModelType } from "../schemas/storage.schemas";
import { BadRequestException, NotFoundException } from "../utils/appError";
import FileModel from "./file.models";
import { formatBytes } from "../utils/formatBytes";
import { ErrorCodeEnum } from "../enum/errorCode.enum";

export const STORAGE_QUOTA = 2 * 1024 * 1024 * 1024;

export const storageSchema = new Schema<StorageInterface, StorageModelType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storageQuota: {
      type: Number,
      default: STORAGE_QUOTA,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

storageSchema.statics = {
  async getStorageMetrics(userId: Types.ObjectId) {
    const storage = await this.findOne({ userId }).lean();
    if (!storage) throw new NotFoundException("Storage record not found");
    const usage = await FileModel.calculateUsage(userId);
    return {
      quota: storage.storageQuota,
      usage,
      remaining: storage.storageQuota - usage,
    };
  },

  async validateUpload(userId:Types.ObjectId,totalFileSize:number){
    if(totalFileSize < 0)
        throw new BadRequestException('File size must be positive');

    const metrics=await this.getStorageMetrics(userId);
    const hasSpace=metrics.remaining>=totalFileSize;

    if(!hasSpace){
        const showFall = totalFileSize - metrics.remaining;
        throw new BadRequestException(
            `Insufficient storage: ${formatBytes(showFall)} needed.`,
            ErrorCodeEnum.INSUFFICIENT_STORAGE
        )
    }

    return {
        allowed:true,
        newUsage:metrics.usage + totalFileSize,
        remainingAfterUpload:metrics.remaining - totalFileSize
    }
  }
};

const StorageModel = mongoose.model<StorageInterface, StorageModelType>(
  "Storage",
  storageSchema
);

export default StorageModel;
