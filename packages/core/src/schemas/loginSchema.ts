import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.email("Hibás e-mail cím formátum."),
  password: z.string().min(1, "A mező kitöltése kötelező."),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
