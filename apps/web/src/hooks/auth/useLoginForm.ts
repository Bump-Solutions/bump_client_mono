import { loginRequestSchema, type LoginRequest } from "@bump/core/schemas";
import { toast } from "sonner";
import { useAppForm } from "../../forms/hooks";
import { useLogin } from "./useLogin";

const loginDefaultValues: LoginRequest = {
  email: "",
  password: "",
};

export const useLoginForm = () => {
  const loginMutation = useLogin();

  return useAppForm({
    defaultValues: loginDefaultValues,

    validators: {
      onSubmit: ({ formApi }) =>
        formApi.parseValuesWithSchema(loginRequestSchema),
    },

    onSubmit: async ({ value, formApi }) => {
      const loginPromise = loginMutation.mutateAsync(value);

      toast.promise(loginPromise, {
        loading: "Bejelentkezés folyamatban...",
        success: "Bejelentkeztél.",
        error: () => "Hiba a bejelentkezés során.",
      });

      await loginPromise;
      formApi.reset();
    },

    onSubmitInvalid: ({ value }) => {
      const { email, password } = value;

      if (!email || !password) {
        toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");
      } else {
        toast.error("Kérjük javítsd a hibás mezőket!");
      }

      throw new Error("Invalid form submission");
    },
  });
};

export type LoginFormApi = ReturnType<typeof useLoginForm>;
