import { ENUM } from "@bump/utils";
import { z } from "zod";

const GENDER_VALUES = ENUM.PRODUCT.GENDER_OPTIONS.map(
  (option) => option.value,
) as readonly number[];
const SIZE_VALUES = ENUM.PRODUCT.SIZE_OPTIONS.map(
  (option) => option.value,
) as readonly number[];
const CONDITION_VALUES = ENUM.PRODUCT.CONDITION_OPTIONS.map(
  (option) => option.value,
) as readonly number[];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED = ["image/png", "image/jpeg", "image/jpg"] as const;

export const sellItemSchema = z.object({
  gender: z
    .number({ error: "A mező kitöltése kötelező." })
    .int()
    .refine((v) => GENDER_VALUES.includes(v), "Érvénytelen érték."),
  size: z
    .number({ error: "A mező kitöltése kötelező." })
    .int()
    .refine((v) => SIZE_VALUES.includes(v), "Érvénytelen érték."),
  condition: z
    .number({ error: "A mező kitöltése kötelező." })
    .int()
    .refine((v) => CONDITION_VALUES.includes(v), "Érvénytelen érték."),
  price: z
    .number({ error: "A mező kitöltése kötelező." })
    .int("Az ár csak egész szám lehet.")
    .min(1, "Az árnak pozitívnak kell lennie."),
});
export type SellItem = z.infer<typeof sellItemSchema>;

export const sellRequestSchema = z.object({
  // step 1
  isCatalog: z.boolean(),

  // step 2
  title: z.string().trim().min(1, "A mező kitöltése kötelező."),
  description: z
    .string()
    .max(500, "Legfeljebb 500 karakter írható.")
    .optional()
    .or(z.literal("")),

  product: z.object({
    id: z.number().int().nullable(), // catalog id if isCatalog
    brand: z.string().trim().min(1, "A mező kitöltése kötelező."),
    model: z.string().trim().min(1, "A mező kitöltése kötelező."),
    colorWay: z.string().trim().min(1, "A mező kitöltése kötelező."),
  }),

  // step 3
  items: z.array(sellItemSchema).min(1, "Legalább egy eladó tételt adj meg."),

  // step 4
  images: z
    .array(
      z
        .custom<File>((v) => v instanceof File, {
          message: "Kép feltöltése kötelező.",
        })
        .superRefine((file, ctx) => {
          if (!(file instanceof File)) return;
          if (!ACCEPTED.includes(file.type as any)) {
            ctx.addIssue({
              code: "custom",
              message: `Érvénytelen fájltípus. Engedélyezett: ${ACCEPTED.join(", ")}.`,
            });
          }
          if (file.size > MAX_SIZE) {
            ctx.addIssue({
              code: "custom",
              message: `A fájl mérete túl nagy. Max: ${MAX_SIZE / (1024 * 1024)} MB.`,
            });
          }
        }),
    )
    .min(3, "Legalább 3 képet tölts fel.")
    .max(10, "Legfeljebb 10 képet tölthetsz fel."),
});

export type SellRequest = z.infer<typeof sellRequestSchema>;
