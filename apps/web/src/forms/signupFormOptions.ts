import { formOptions } from "@tanstack/react-form";
import {
  signupWizardSchema,
  type SignupWizardValues,
} from "../schemas/signupWizard";

export const signupDefaultValues: SignupWizardValues = {
  account: {
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  },
  personal: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: null,
  },
};

export const signupFormOptions = formOptions({
  defaultValues: signupDefaultValues,
  validators: {
    onSubmit: ({ formApi }) =>
      formApi.parseValuesWithSchema(signupWizardSchema),
  },
});
