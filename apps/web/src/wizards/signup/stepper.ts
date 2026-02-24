import { defineStepper } from "@stepperize/react";
import {
  signupAccountStepSchema,
  signupPersonalStepSchema,
} from "../../schemas/signupWizard";

export const {
  Scoped: SignupScoped,
  useStepper: useSignupStepper,
  steps: SIGNUP_STEPS,
} = defineStepper(
  {
    id: "account",
    title: "Fiók információ",
    schema: signupAccountStepSchema,
    basePath: "account",
  },
  {
    id: "personal",
    title: "Személyes adatok",
    schema: signupPersonalStepSchema,
    basePath: "personal",
  },
);
