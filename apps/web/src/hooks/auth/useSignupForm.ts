import { useAppForm } from "../../forms/hooks";
import { signupFormOptions } from "../../forms/signupFormOptions";

export const useSignupForm = () => {
  return useAppForm({
    ...signupFormOptions,

    onSubmit: async ({ value, formApi }) => {
      console.log("Submitting form with values:", value, formApi);
    },

    onSubmitInvalid: async () => {
      throw new Error("Invalid form submission");
    },
  });
};

export type SignupFormApi = ReturnType<typeof useSignupForm>;
