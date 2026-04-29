import { FORM_INVALID_TOAST } from "@/forms/constants";
import type { SellFormApi } from "@/hooks/sell/useSellForm";
import { sellItemSchema, type SellItem } from "@bump/core/schemas";
import { ENUM } from "@bump/utils";
import { useStore, type AnyFieldApi } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";

import Button from "@/components/Button";
import FieldGroup from "@/forms/FieldGroup";

import { CirclePlus } from "lucide-react";

type ItemFormProps = {
  form: SellFormApi;
};

const DEFAULT_DRAFT = {
  gender: null,
  size: null,
  condition: null,
  price: null,
  count: 1,
};

const DRAFT_FIELD_NAMES = [
  "gender",
  "size",
  "condition",
  "price",
  "count",
] as const;

const clearDraftMetaOnChange = ({ fieldApi }: { fieldApi: AnyFieldApi }) => {
  fieldApi.setMeta((prev) => ({
    ...prev,
    errors: [],
    errorMap: {},
  }));
};

const ItemForm = ({ form }: ItemFormProps) => {
  const items = useStore(
    form.store,
    (state) => state.values.items.items,
  ) as SellItem[];

  useEffect(() => {
    return () => {
      DRAFT_FIELD_NAMES.forEach((fieldName) => {
        form.setFieldMeta(`items.draft.${fieldName}`, (prev) => ({
          ...prev,
          isTouched: false,
          errors: [],
          errorMap: {},
        }));
      });
    };
  }, [form]);

  const handleAddItem = () => {
    const draft = form.getFieldValue("items.draft") ?? DEFAULT_DRAFT;
    const count = draft.count;

    // Candidate objektum validációhoz
    const candidate = {
      gender: draft.gender ?? null,
      size: draft.size ?? null,
      condition: draft.condition ?? null,
      price: draft.price ?? null,
    };

    const result = sellItemSchema.safeParse(candidate);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof typeof draft;
        const message = issue.message;

        form.setFieldMeta(`items.draft.${fieldName}`, (prev) => ({
          ...prev,
          isTouched: true,
          errors: [message],
          errorMap: { ...prev.errorMap, onChange: message },
        }));
      });

      toast.error(FORM_INVALID_TOAST);
      return;
    }

    const validItem = result.data as SellItem; // Ha valid, akkor kész SellItem
    const newItems = Array.from({ length: count }, () => validItem); // Új tételek létrehozása a count alapján

    // Frissíti a tömböt
    form.setFieldValue("items.items", [...items, ...newItems]);

    // Visszaállítja a draftot + meta (errors/touched) tisztítása
    DRAFT_FIELD_NAMES.forEach((fieldName) => {
      form.setFieldValue(
        `items.draft.${fieldName}`,
        DEFAULT_DRAFT[fieldName],
      );
      form.setFieldMeta(`items.draft.${fieldName}`, (prev) => ({
        ...prev,
        isTouched: false,
        errors: [],
        errorMap: {},
      }));
    });
  };

  return (
    <div className='item__column'>
      {/* --- Nem mező --- */}
      <form.AppField
        name='items.draft.gender'
        listeners={{ onChange: clearDraftMetaOnChange }}>
        {(field) => (
          <field.Select
            label='Nem'
            options={ENUM.PRODUCT.GENDER_OPTIONS}
            required
          />
        )}
      </form.AppField>

      {/* --- Méret mező --- */}
      <form.AppField
        name='items.draft.size'
        listeners={{ onChange: clearDraftMetaOnChange }}>
        {(field) => (
          <field.Select
            label='Méret'
            isSearchable
            options={ENUM.PRODUCT.SIZE_OPTIONS}
            required
          />
        )}
      </form.AppField>

      {/* --- Állapot mező --- */}
      <form.AppField
        name='items.draft.condition'
        listeners={{ onChange: clearDraftMetaOnChange }}>
        {(field) => (
          <field.Select
            label='Állapot'
            options={ENUM.PRODUCT.CONDITION_OPTIONS}
            required
          />
        )}
      </form.AppField>

      {/* --- Ár mező --- */}
      <form.AppField
        name='items.draft.price'
        listeners={{ onChange: clearDraftMetaOnChange }}>
        {(field) => (
          <field.Currency
            label='Ár'
            required
            maxValue={99_999_999}
            suffix='HUF'
            placeholder='52 999'
          />
        )}
      </form.AppField>

      <FieldGroup columns={2} className='mt-0_5'>
        {/* --- Darabszám mező  --- */}
        <form.AppField name='items.draft.count'>
          {(field) => <field.Stepper min={1} max={20} step={1} />}
        </form.AppField>

        {/* --- Hozzáadás gomb --- */}
        <Button
          type='button'
          text='Hozzáadás'
          className='primary br-1 flex-1'
          onClick={handleAddItem}>
          <CirclePlus />
        </Button>
      </FieldGroup>
    </div>
  );
};

export default ItemForm;
