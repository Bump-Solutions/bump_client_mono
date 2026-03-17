import type { CreateProductModel } from "@bump/core/models";
import { useMounted } from "@bump/hooks";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../context/auth/useAuth";
import { useAppForm } from "../../forms/hooks";
import { sellFormOptions } from "../../forms/sellFormOptions";
import { ROUTES } from "../../routes/routes";
import { useUploadProduct } from "../product/useUploadProduct";

export const useSellForm = () => {
  const { auth } = useAuth();

  const navigate = useNavigate();
  const isMounted = useMounted();

  const uploadMutation = useUploadProduct(() => {
    setTimeout(() => {
      if (isMounted()) {
        navigate(-1);
      }
    }, 1000);
  });

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

    onSubmitInvalid: async () => {
      throw new Error("Invalid form submission");
    },
  });
};

export type SellFormApi = ReturnType<typeof useSellForm>;
