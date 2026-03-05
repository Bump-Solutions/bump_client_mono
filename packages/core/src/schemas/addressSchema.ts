import { REGEX } from "@bump/utils";
import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(1, "A mező kitöltése kötelező."),
  country: z.string().min(1, "A mező kitöltése kötelező."),
  city: z.string().min(1, "A mező kitöltése kötelező."),
  zip: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .regex(REGEX.ZIP, "Az irányítószámnak 4 számjegyből kell állnia."),
  street: z.string().min(1, "A mező kitöltése kötelező."),
  default: z.boolean(),
});

export type AddressValues = z.infer<typeof addressSchema>;
