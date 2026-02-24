import { ENUM, REGEX } from "@bump/utils";
import { z } from "zod";

const GENDER_VALUES = ENUM.AUTH.GENDER_OPTIONS.map(
  (option) => option.value,
) as readonly number[];

export const signupRequestSchema = z.object({
  email: z.email("Hibás e-mail cím formátum"),
  username: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .min(4, "A felhasználónévnek legalább 4 karakter hosszúnak kell lennie.")
    .max(16, "A felhasználónév legfeljebb 16 karakter hosszú lehet.")
    .regex(REGEX.USERNAME, "Hibás felhasználónév formátum."),
  password: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie.")
    .max(20, "A jelszó legfeljebb 20 karakter hosszú lehet.")
    .refine(
      (s) => REGEX.PASSWORD.DIGIT.test(s),
      "A jelszónak tartalmaznia kell legalább egy számot.",
    )
    .refine(
      (s) => REGEX.PASSWORD.LOWERCASE.test(s),
      "A jelszónak tartalmaznia kell legalább egy kisbetűt.",
    )
    .refine(
      (s) => REGEX.PASSWORD.UPPERCASE.test(s),
      "A jelszónak tartalmaznia kell legalább egy nagybetűt.",
    ),
  firstName: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .refine((s) => REGEX.NAME.test(s), {
      message: "Hibás keresztnév formátum.",
    }),
  lastName: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .refine((s) => REGEX.NAME.test(s), {
      message: "Hibás vezetéknév formátum.",
    }),
  phoneNumber: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .refine((s) => REGEX.PHONE.test(s), {
      message: "Hibás telefonszám. Formátum: +36xx-xxx-xxxx",
    }),
  gender: z
    .number()
    .int()
    .refine((n) => GENDER_VALUES.includes(n))
    .optional()
    .nullable(),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;
