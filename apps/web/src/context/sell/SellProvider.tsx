import type { CreateProductModel } from "@bump/core/models";
import type { FormErrors } from "@bump/types";
import { useState } from "react";
import { SellContext } from "./context";
import type { SellProviderProps } from "./types";

const INITIAL_DATA: CreateProductModel = {
  title: "",
  description: "",
  product: {
    isCatalog: true,
    id: null,
    brand: "",
    model: "",
    colorWay: "",
  },
  items: [],
  images: [],
};

const SellProvider = ({ children }: SellProviderProps) => {
  const [data, setData] = useState<CreateProductModel>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateData = (fields: Partial<CreateProductModel>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const clearErrors = () => {
    if (errors) {
      Object.keys(errors).forEach((key) => {
        if (errors[key] !== "") {
          setErrors((prev) => ({
            ...prev,
            [key]: "",
          }));
          setData((prev) => ({
            ...prev,
            [key]: INITIAL_DATA[key as keyof CreateProductModel],
          }));
        }
      });
    }
  };

  return (
    <SellContext
      value={{
        data,
        updateData,
        errors,
        setErrors,
        clearErrors,
      }}>
      {children}
    </SellContext>
  );
};

export default SellProvider;
