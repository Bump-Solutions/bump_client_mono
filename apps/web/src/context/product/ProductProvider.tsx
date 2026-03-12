import type { ProductModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import Spinner from "../../components/Spinner";
import { useGetProduct } from "../../hooks/product/useGetProduct";
import { ROUTES } from "../../routes/routes";
import { ProductContext } from "./context";
import type { ProductContextValue, ProductProviderProps } from "./types";

const ProductProvider = ({ children }: ProductProviderProps) => {
  const { pid } = useParams();

  if (!pid)
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás termékazonosító",
            message: `Sajnáljuk, a megadott termékazonosító nem található. Megeshet, hogy elírás van az azonosítóban, vagy a termék törölve lett.`,
          },
        }}
      />
    );

  return <ProductProviderInner pid={pid}>{children}</ProductProviderInner>;
};

const ProductProviderInner = ({
  pid,
  children,
}: {
  pid: string;
  children: ReactNode;
}) => {
  const productId = Number(pid);
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useGetProduct(productId);

  const setProduct = useCallback(
    (data: Partial<ProductModel>) => {
      queryClient.setQueryData<ProductModel>(
        queryKeys.product.get(productId),
        (prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            ...data,
          };
        },
      );
    },
    [queryClient, productId],
  );

  const contextValue = useMemo<ProductContextValue | undefined>(() => {
    if (!product) return undefined;

    return {
      product,
      setProduct,
    };
  }, [product, setProduct]);

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás termékazonosító",
            message: `Sajnáljuk, a(z) "${productId}" azonosítójú termék nem található. Megeshet, hogy elírás van az azonosítóban, vagy a termék törölve lett.`,
          },
        }}
      />
    );
  }

  if (isLoading || !product) {
    return <Spinner />;
  }

  return <ProductContext value={contextValue}>{children}</ProductContext>;
};

export default ProductProvider;
