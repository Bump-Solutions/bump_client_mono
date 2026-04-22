import { loginRequestSchema, type LoginRequest } from "@bump/core/schemas";
import { toast } from "sonner";
import { FORM_INVALID_ERROR, FORM_INVALID_TOAST } from "@/forms/constants";
import { useAppForm } from "@/forms/hooks";
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
        toast.error(FORM_INVALID_TOAST);
      }

      throw new Error(FORM_INVALID_ERROR);
    },
  });
};

export type LoginFormApi = ReturnType<typeof useLoginForm>;
