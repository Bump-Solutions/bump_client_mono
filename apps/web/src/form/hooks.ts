import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import FormCurrency from "./FormCurrency";
import FormDropzone from "./FormDropzone";
import FormInput from "./FormInput";
import FormPassword from "./FormPassword";
import FormSelect from "./FormSelect";
import FormStepper from "./FormStepper";
import FormTextArea from "./FormTextArea";
import FormToggleButton from "./FormToggleButton";

export type AppFormApi = ReturnType<typeof useAppForm>;

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Input: FormInput,
    Dropzone: FormDropzone,
    Password: FormPassword,
    Select: FormSelect,
    Stepper: FormStepper,
    TextArea: FormTextArea,
    ToggleButton: FormToggleButton,
    Currency: FormCurrency,
  },
  formComponents: {},
});

export { useAppForm, useFieldContext, useFormContext, withForm };
