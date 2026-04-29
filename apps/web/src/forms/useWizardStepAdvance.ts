import { touchFields, validateFields, validateZodSection } from "@bump/forms";
import type { AnyFormApi } from "@tanstack/react-form";
import { useCallback } from "react";
import { toast } from "sonner";
import type { ZodType } from "zod";

import { FORM_INVALID_ERROR, FORM_INVALID_TOAST } from "./constants";

type WizardStepper = {
  state: { isLast: boolean };
  navigation: { next: () => void };
};

export const useWizardStepAdvance = (
  form: AnyFormApi,
  stepper: WizardStepper,
  fields: readonly string[],
  basePath: string,
  schema: ZodType<unknown>,
) => {
  return useCallback(async () => {
    touchFields(form, fields);
    await validateFields(form, fields, "submit");

    const sectionValue = (form.state.values as Record<string, unknown>)[
      basePath
    ];

    const result = validateZodSection(form, basePath, sectionValue, schema, {
      writeToMeta: true,
    });

    if (!result.ok) {
      toast.error(FORM_INVALID_TOAST);
      throw new Error(FORM_INVALID_ERROR);
    }

    if (!stepper.state.isLast) {
      stepper.navigation.next();
    } else {
      form.handleSubmit();
    }
  }, [form, stepper, fields, basePath, schema]);
};
