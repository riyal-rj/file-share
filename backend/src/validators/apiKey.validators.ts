import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
});

export const deleteApiKeySchema = z.object({
  id: z.string().min(1),
});
