import type { AnyFormApi } from "@tanstack/react-form";
import { toast } from "sonner";

import { FORM_INVALID_ERROR, FORM_INVALID_TOAST } from "./constants";

export const submitWithInvalidToast = async (form: AnyFormApi) => {
  await form.handleSubmit();

  if (!form.store.state.isValid) {
    toast.error(FORM_INVALID_TOAST);
    throw new Error(FORM_INVALID_ERROR);
  }
};
