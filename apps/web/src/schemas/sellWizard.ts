import { sellRequestSchema } from "@bump/core/schemas";
import { z } from "zod";

// Step 1
export const sellSelectStepSchema = sellRequestSchema.pick({
  isCatalog: true,
});

// Step 2
export const sellDetailsStepSchema = sellRequestSchema.pick({
  title: true,
  description: true,
  product: true,
});

// Step 3 (only items array)
export const sellItemsStepSchema = z.object({
  items: sellRequestSchema.shape.items, // array + min(1)
});

// Step 4
export const sellUploadStepSchema = sellRequestSchema.pick({
  images: true,
});

export const itemDraftSchema = z.object({
  gender: z.number().nullable(),
  size: z.number().nullable(),
  condition: z.number().nullable(),
  price: z.number().nullable(),
  count: z.number().min(1).max(20),
});

export const sellWizardSchema = z.object({
  select: sellSelectStepSchema,
  details: sellDetailsStepSchema,
  items: sellItemsStepSchema.extend({
    draft: itemDraftSchema.optional(),
  }),
  upload: sellUploadStepSchema,
});

export type SellWizardValues = z.infer<typeof sellWizardSchema>;
