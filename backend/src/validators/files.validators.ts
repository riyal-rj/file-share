import { z } from "zod";

export const fileIdSchema = z.string().trim().min(1);

export const baseSchema = z.object({
    fileIds:z
            .array(z.string().length(24,"Invalid file id"))
            .min(1,"At least one file id is required")
});

export const deleteFileSchema = baseSchema;
export const downloadFileSchema = baseSchema;

export type DeleteFileSchemaType = z.infer<typeof deleteFileSchema>;
export type DownloadFileSchemaType = z.infer<typeof downloadFileSchema>;