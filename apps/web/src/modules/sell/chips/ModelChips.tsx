import type { ModelModel, ModelsPageModel } from "@bump/core/models";
import { useStore } from "@tanstack/react-form";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useToggle } from "react-use";
import { useListAvailableModels } from "../../../hooks/product/useListAvailableModels";
import type { SellFormApi } from "../../../hooks/sell/useSellForm";
import { sellDetailsStepSchema } from "../../../schemas/sellWizard";

import Chip from "../../../components/Chip";
import Spinner from "../../../components/Spinner";
import SearchChip from "./SearchChip";

import { X } from "lucide-react";

type ModelChipsProps = {
  form: SellFormApi;
};

const ModelChips = ({ form }: ModelChipsProps) => {
  const isCatalog = useStore(
    form.store,
    (state) => state.values.select.isCatalog as boolean,
  );
  const selectedBrand = useStore(
    form.store,
    (state) => state.values.details.product.brand as string,
  );
  const selectedModel = useStore(
    form.store,
    (state) => state.values.details.product.model as string,
  );

  const modelError = useStore(form.store, (state) => {
    const meta = state.fieldMeta["details.product.model"];
    if (!meta || !meta.isTouched || meta.isValid) return undefined;

    const errorMap = meta.errorMap ?? {};
    const fromSubmit = errorMap.onSubmit ?? [];

    const allErrors = [
      ...(Array.isArray(fromSubmit) ? fromSubmit : [fromSubmit]),
    ].filter(Boolean);

    const first = allErrors[0];
    if (!first) return undefined;

    return typeof first === "string" ? first : first.message;
  });

  const [q, setQ] = useState<string>("");
  const [showAll, toggleShowAll] = useToggle(false);

  const {
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    data: resp,
  } = useListAvailableModels({
    isCatalogProduct: isCatalog,
    brand: selectedBrand,
    searchKey: q,
  });

  const pages = useMemo<ModelsPageModel[]>(() => {
    if (!selectedBrand) return [];

    if (isLoading || !resp?.pages?.length) return [];

    const firstPage = resp.pages[0];

    // showAll => just use all pages from the query
    if (showAll) return resp.pages;

    // not showAll => only first page, but ensure selectedModel is visible
    if (
      !selectedModel ||
      firstPage.products.some((m: ModelModel) => m.model === selectedModel)
    ) {
      return [firstPage];
    }

    return [
      {
        ...firstPage,
        products: [{ model: selectedModel }, ...firstPage.products],
      },
    ];
  }, [resp, showAll, selectedBrand, selectedModel, isLoading]);

  useEffect(() => {
    if (showAll && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [showAll, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const remainingCount =
    pages.length > 0
      ? pages[0].count -
        pages.reduce((sum, page) => sum + page.products.length, 0)
      : 0;

  const handleSelect = (model: string) => {
    if (model === selectedModel) {
      // unselect – mindent tisztítunk
      form.setFieldValue("details.product.brand", selectedBrand);
      form.setFieldValue("details.product.model", "");
      form.setFieldValue("details.product.colorWay", "");
      form.setFieldValue("details.product.id", null);

      form.resetField("details.product.model");

      return;
    }
    // új model – cascade reset
    form.setFieldValue("details.product.brand", selectedBrand);
    form.setFieldValue("details.product.model", model);
    form.setFieldValue("details.product.colorWay", "");
    form.setFieldValue("details.product.id", null);

    form.setFieldMeta("details.product.model", (prev) => ({
      ...prev,
      errorMap: {},
      errors: [],
    }));
  };

  return (
    <div className='my-0_5'>
      <form.AppField
        name='details.product.model'
        validators={{
          onChange: sellDetailsStepSchema.shape.product.shape.model,
        }}>
        {() => null}
      </form.AppField>

      <label className='fs-18'>
        Modell{" "}
        <span
          className={`transition-clr ${
            selectedModel ? "fc-red-500" : "fc-red-200"
          }`}>
          *
        </span>
      </label>
      <p className='fs-14 fc-gray-600'>
        {selectedBrand
          ? "Válassz az alábbiak közül"
          : "Először válassz márkát!"}
      </p>

      {isError && (
        <h4 className='fc-red-500 ta-center py-2'>
          Hiba történt a modellek betöltése közben.
        </h4>
      )}

      {isLoading && (
        <div className='relative py-2'>
          <Spinner />
        </div>
      )}

      {!isError && !isLoading && pages.length > 0 && (
        <ul className='chips__wrapper'>
          <li>
            <SearchChip
              searchKeyDebounced={q}
              onSearchDebounced={(debouncedValue) => {
                setQ(debouncedValue);
              }}
            />
          </li>

          {pages.map((page, index) => (
            <Fragment key={index}>
              {page.products.map((model) => (
                <li key={model.model}>
                  <Chip
                    label={model.model}
                    selected={selectedModel === model.model}
                    onClick={() => handleSelect(model.model)}
                  />
                </li>
              ))}
            </Fragment>
          ))}
          <li>
            {showAll ? (
              <Chip svg={<X />} onClick={() => toggleShowAll(false)} />
            ) : (
              remainingCount > 0 && (
                <Chip
                  label={`+${remainingCount}`}
                  onClick={() => toggleShowAll(true)}
                />
              )
            )}
          </li>
        </ul>
      )}

      {modelError && <em className='fc-red-500'>{modelError}</em>}
    </div>
  );
};

export default ModelChips;
