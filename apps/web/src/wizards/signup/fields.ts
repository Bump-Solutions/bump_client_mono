export const SIGNUP_FIELDS = {
  account: [
    "account.email",
    "account.username",
    "account.password",
    "account.passwordConfirmation",
  ],
  personal: [
    "personal.firstName",
    "personal.lastName",
    "personal.phoneNumber",
    "personal.gender",
  ],
} as const;

export type SignupStepId = keyof typeof SIGNUP_FIELDS; // "account" | "personal"
