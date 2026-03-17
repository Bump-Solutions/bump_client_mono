import { formOptions } from "@tanstack/react-form";
import {
  itemDraftSchema,
  sellWizardSchema,
  type SellWizardValues,
} from "../schemas/sellWizard";

export const sellDefaultValues: SellWizardValues = {
  select: {
    isCatalog: true,
  },
  details: {
    title: "",
    description: "",

    product: {
      id: null,
      brand: "",
      model: "",
      colorWay: "",
    },
  },
  items: {
    draft: itemDraftSchema.parse({
      gender: null,
      size: null,
      condition: null,
      price: null,
      count: 1,
    }),
    items: [],
  },
  upload: {
    images: [],
  },
};

export const sellFormOptions = formOptions({
  defaultValues: sellDefaultValues,
  validators: {
    onSubmit: ({ formApi }) => formApi.parseValuesWithSchema(sellWizardSchema),
  },
});
