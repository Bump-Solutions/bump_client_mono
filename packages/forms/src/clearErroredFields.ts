import type { AnyFormApi } from "@tanstack/react-form";

type ClearErroredFieldsOptions = {
  /** If true, also set isTouched to false */
  resetTouched?: boolean;
  /** If true, reset field value too (stronger than just clearing errors) */
  resetValue?: boolean;
};

function hasErrors(meta: unknown): boolean {
  const m = meta as { errors?: unknown; errorMap?: unknown };
  const errs = m?.errors;
  const map = m?.errorMap;

  const errorsExist = Array.isArray(errs) ? errs.length > 0 : Boolean(errs);

  const mapExist =
    map && typeof map === "object"
      ? Object.keys(map as object).length > 0
      : false;

  return errorsExist || mapExist;
}

/**
 * Clears only errored fields' meta (errors + errorMap), optionally resets touched and/or value.
 */
export function clearErroredFields(
  form: AnyFormApi,
  fields: readonly string[],
  opts: ClearErroredFieldsOptions = {},
) {
  const { resetTouched = false, resetValue = false } = opts;

  fields.forEach((field) => {
    const meta = form.getFieldMeta(field as never);
    if (!hasErrors(meta)) return;

    if (resetValue) {
      form.resetField(field as never);
      return;
    }

    form.setFieldMeta(field as never, (prev: any) => ({
      ...prev,
      errors: [],
      errorMap: {},
      ...(resetTouched ? { isTouched: false } : null),
    }));
  });
}
