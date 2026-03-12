import type { ProductModel } from "@bump/core/models";
import { useMemo, useState } from "react";
import { useProduct } from "../../context/product/useProduct";

export type FacetProps = {
  quantity: number;
  genders: number[];
  sizes: number[];
  conditions: number[];

  selectedGender: number | null;
  selectedSize: number | null;
  selectedCondition: number | null;

  setQuantity: (value: number) => void;
  setGender: (value: number) => void;
  setSize: (value: number) => void;
  setCondition: (value: number) => void;
  reset: () => void;

  available: ProductModel["items"]; // All available items (state === 1)
  filtered: ProductModel["items"] | null; // Filtered items based on selected facets

  filteredCount: number;
  filteredMinPrice: number | null;
  firstFilteredItemId: number | null;

  hasProduct: boolean;
  hasAvailableItems: boolean;
};

export const useFacetedSearch = (): FacetProps => {
  const { product } = useProduct();

  const [quantity, setQuantity] = useState<number>(1);
  const [gender, setGender] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [condition, setCondition] = useState<number | null>(null);

  const items = useMemo(() => product.items || [], [product.items]);
  const available = useMemo(() => items.filter((i) => i.state === 0), [items]); // 0 - available

  const genders = useMemo(() => {
    return [...new Set(available.map((item) => item.gender))].sort(
      (a, b) => a - b,
    );
  }, [available]);

  const sizes = useMemo(() => {
    if (gender === null) return [];

    return [
      ...new Set(
        available
          .filter((item) => item.gender === gender)
          .map((item) => Number(item.size)),
      ),
    ].sort((a, b) => a - b);
  }, [available, gender]);

  const conditions = useMemo(() => {
    if (gender === null || size === null) return [];

    return [
      ...new Set(
        available
          .filter(
            (item) => item.gender === gender && Number(item.size) === size,
          )
          .map((item) => item.condition),
      ),
    ].sort((a, b) => a - b);
  }, [available, gender, size]);

  const filtered = useMemo(() => {
    if (gender === null || size === null || condition === null) {
      return null;
    }

    const result = available
      .filter(
        (item) =>
          item.gender === gender &&
          Number(item.size) === size &&
          item.condition === condition,
      )
      .sort((a, b) => a.id - b.id);

    return result.length > 0 ? result : null;
  }, [available, gender, size, condition]);

  const filteredCount = filtered?.length ?? 0;

  const filteredMinPrice = useMemo(() => {
    if (!filtered || filtered.length === 0) return null;
    return Math.min(...filtered.map((item) => item.price));
  }, [filtered]);

  const firstFilteredItemId = filtered?.[0]?.id ?? null;

  const handleSelectGender = (value: number) => {
    setGender(value);
    setSize(null);
    setCondition(null);
    setQuantity(1);
  };

  const handleSelectSize = (value: number) => {
    setSize(value);
    setCondition(null);
    setQuantity(1);
  };

  const reset = () => {
    setGender(null);
    setSize(null);
    setCondition(null);
    setQuantity(1);
  };

  return {
    quantity,
    genders,
    sizes,
    conditions,

    selectedGender: gender,
    selectedSize: size,
    selectedCondition: condition,

    setQuantity,
    setGender: handleSelectGender,
    setSize: handleSelectSize,
    setCondition,
    reset,

    available,
    filtered,

    filteredCount,
    filteredMinPrice,
    firstFilteredItemId,

    hasProduct: Boolean(product),
    hasAvailableItems: available.length > 0,
  };
};
