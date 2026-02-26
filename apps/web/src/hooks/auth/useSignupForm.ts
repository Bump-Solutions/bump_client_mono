import type { SignupModel } from "@bump/core/models";
import { useAppForm } from "../../forms/hooks";
import { signupFormOptions } from "../../forms/signupFormOptions";

import { toast } from "sonner";

import { useLogin } from "./useLogin";
import { useSignup } from "./useSignup";

export const useSignupForm = () => {
  const signupMutation = useSignup();
  const loginMutation = useLogin();

  return useAppForm({
    ...signupFormOptions,

    onSubmit: async ({ value, formApi }) => {
      const data: SignupModel = {
        email: value.account.email,
        username: value.account.username,
        password: value.account.password,
        passwordConfirmation: value.account.passwordConfirmation,
        firstName: value.personal.firstName,
        lastName: value.personal.lastName,
        phoneNumber: value.personal.phoneNumber,
        gender: value.personal.gender ?? null,
      };

      const signupPromise = signupMutation.mutateAsync(data);

      toast.promise(signupPromise, {
        loading: "Regisztráció folyamatban...",
        success: "Sikeres regisztráció. Bejelentkezés...",
        error: () => "Hiba a regisztráció során.",
      });

      await signupPromise.then(() => {
        loginMutation.mutateAsync({
          email: data.email,
          password: data.password,
        });
      });

      formApi.reset();
    },

    onSubmitInvalid: async () => {
      throw new Error("Invalid form submission");
    },
  });
};

export type SignupFormApi = ReturnType<typeof useSignupForm>;
