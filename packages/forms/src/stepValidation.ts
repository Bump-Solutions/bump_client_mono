import type { AnyFormApi, ValidationCause } from "@tanstack/react-form";
import type { z } from "zod";

type ZodIssueLike = z.core.$ZodIssue;

export function touchFields(form: AnyFormApi, fields: readonly string[]) {
  fields.forEach((field) => {
    form.setFieldMeta(field as never, (prev: any) => ({
      ...prev,
      touched: true,
    }));
  });
}

export async function validateFields(
  form: AnyFormApi,
  fields: readonly string[],
  cause: ValidationCause = "submit",
) {
  await Promise.all(
    fields.map((field) => form.validateField(field as never, cause)),
  );
}

export function applyZodIssuesToMeta(
  form: AnyFormApi,
  basePath: string,
  issues: ZodIssueLike[],
  cause: "onSubmit" | "onChange" | "onBlur" = "onSubmit",
) {
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;

    const fieldPath = `${basePath}.${key}`;
    form.setFieldMeta(fieldPath as never, (prev: any) => ({
      ...prev,
      isTouched: true,
      errors: [issue.message],
      errorMap: { ...(prev?.errorMap ?? {}), [cause]: issue.message },
    }));
  }
}

export function validateZodSection<T>(
  form: AnyFormApi,
  basePath: string,
  value: T,
  schema: z.ZodType<T>,
  opts?: { writeToMeta?: boolean },
) {
  const result = schema.safeParse(value);
  if (result.success) return { ok: true as const };

  if (opts?.writeToMeta) {
    applyZodIssuesToMeta(form, basePath, result.error.issues);
  }

  return { ok: false as const, issues: result.error.issues };
}
