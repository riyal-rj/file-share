import mongoose, { Schema } from "mongoose";
import { ApiKeyInterface, ApiKeyModelType } from "../schemas/api.schemas";

const apiKeySchema = new Schema<ApiKeyInterface, ApiKeyModelType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    displayKey: {
      type: String,
      required: true,
    },
    hashedKey: {
      type: String,
      required: true,
      select: false,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

apiKeySchema.statics.uploadLastUsedAt = async function (
  hashedKey: string): Promise<void> {
  await this.updateOne({ hashedKey }, { lastUsedAt: new Date() });
};

const ApiKeyModel = mongoose.model<ApiKeyInterface, ApiKeyModelType>("ApiKey",apiKeySchema);

export default ApiKeyModel;
