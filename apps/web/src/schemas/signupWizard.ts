import { signupRequestSchema } from "@bump/core/schemas";
import { z } from "zod";

export const signupAccountStepSchema = signupRequestSchema
  .pick({
    email: true,
    username: true,
    password: true,
  })
  .extend({
    passwordConfirmation: z.string().min(1, "A mező kitöltése kötelező."),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirmation"],
        message: "A jelszavak nem egyeznek.",
      });
    }
  });

export const signupPersonalStepSchema = signupRequestSchema.pick({
  firstName: true,
  lastName: true,
  phoneNumber: true,
  gender: true,
});

export const signupWizardSchema = z.object({
  account: signupAccountStepSchema,
  personal: signupPersonalStepSchema,
});

export type SignupWizardValues = z.infer<typeof signupWizardSchema>;
