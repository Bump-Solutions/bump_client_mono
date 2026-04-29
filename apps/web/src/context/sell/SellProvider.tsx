import type { CreateProductModel } from "@bump/core/models";
import type { FormErrors } from "@bump/types";
import { useCallback, useMemo, useState } from "react";
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

  const updateData = useCallback((fields: Partial<CreateProductModel>) => {
    setData((prev) => ({ ...prev, ...fields }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors((prevErrors) => {
      const keys = Object.keys(prevErrors).filter((k) => prevErrors[k] !== "");
      if (keys.length === 0) return prevErrors;

      setData((prev) => {
        const next = { ...prev };
        for (const key of keys) {
          (next as Record<string, unknown>)[key] =
            INITIAL_DATA[key as keyof CreateProductModel];
        }
        return next;
      });

      const cleared = { ...prevErrors };
      for (const key of keys) cleared[key] = "";
      return cleared;
    });
  }, []);

  const value = useMemo(
    () => ({ data, updateData, errors, setErrors, clearErrors }),
    [data, updateData, errors, clearErrors],
  );

  return <SellContext value={value}>{children}</SellContext>;
};

export default SellProvider;
