import type { CreateProductModel } from "@bump/core/models";
import type { FormErrors } from "@bump/types";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export type SellProviderProps = {
  children: ReactNode;
};

export type SellContextValue = {
  data: CreateProductModel;
  updateData: (fields: Partial<CreateProductModel>) => void;
  errors: FormErrors;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  clearErrors: () => void;
};
