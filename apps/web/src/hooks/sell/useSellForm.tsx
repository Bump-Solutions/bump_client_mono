import { useAuth } from "@/context/auth/useAuth";
import { FORM_INVALID_ERROR } from "@/forms/constants";
import { useAppForm } from "@/forms/hooks";
import { sellFormOptions } from "@/forms/sellFormOptions";
import { useDelayedClose } from "@/hooks/common/useDelayedClose";
import { ROUTES } from "@/routes/routes";
import type { CreateProductModel } from "@bump/core/models";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useUploadProduct } from "../product/useUploadProduct";

export const useSellForm = () => {
  const { auth } = useAuth();

  const navigate = useNavigate();

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const delayedBack = useDelayedClose(goBack, 1000);

  const uploadMutation = useUploadProduct(delayedBack);

  return useAppForm({
    ...sellFormOptions,

    onSubmit: async ({ value, formApi }) => {
      const data: CreateProductModel = {
        title: value.details.title,
        description: value.details.description || "",

        product: {
          isCatalog: value.select.isCatalog,
          id: value.details.product.id,
          brand: value.details.product.brand,
          model: value.details.product.model,
          colorWay: value.details.product.colorWay,
        },

        items: value.items.items.map((item) => ({
          condition: item.condition,
          gender: item.gender,
          size: item.size,
          price: item.price,
        })),

        images: value.upload.images.map((file) => file),
      };

      const uploadPromise = uploadMutation.mutateAsync({ newProduct: data });

      toast.promise(uploadPromise, {
        loading: "Létrehozás folyamatban...",
        success: () => (
          <span>
            Termék létrehozva. Megtekintheted{" "}
            <Link
              className='link fc-green-600 underline fw-700'
              to={ROUTES.PROFILE(auth?.user?.username || "").PRODUCTS}>
              itt.
            </Link>
          </span>
        ),
        error: () => "Hiba a termék létrehozása során.",
      });

      formApi.reset();

      return uploadPromise;
    },

    onSubmitInvalid: async ({ formApi }) => {
      const invalidFields = Object.entries(formApi.state.fieldMeta)
        .filter(([, meta]) => meta && !meta.isValid)
        .map(([name, meta]) => ({
          name,
          errors: meta?.errors,
          errorMap: meta?.errorMap,
        }));
      // eslint-disable-next-line no-console
      console.warn("[SellForm] invalid submit", {
        formErrors: formApi.state.errors,
        formErrorMap: formApi.state.errorMap,
        invalidFields,
      });
      throw new Error(FORM_INVALID_ERROR);
    },
  });
};

export type SellFormApi = ReturnType<typeof useSellForm>;
