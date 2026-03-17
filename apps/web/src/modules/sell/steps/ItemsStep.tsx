import { clearErroredFields } from "@bump/forms";
import { useStore } from "@tanstack/react-form";
import type { SellFormApi } from "../../../hooks/sell/useSellForm";
import { SELL_FIELDS } from "../../../wizards/sell/fields";
import { SELL_STEPS, useSellStepper } from "../../../wizards/sell/stepper";

import Button from "../../../components/Button";
import ItemForm from "../parts/ItemForm";
import ItemsList from "../parts/ItemsList";

import { MoveRight } from "lucide-react";

type ItemsStepProps = {
  form: SellFormApi;
  next: () => void;
};

const ItemsStep = ({ form, next }: ItemsStepProps) => {
  const stepper = useSellStepper();

  const isBusy = useStore(
    form.store,
    (state) =>
      state.isValidating || state.isFormValidating || state.isFieldsValidating,
  );

  const prev = () => {
    clearErroredFields(form, SELL_FIELDS.items, { resetTouched: true });
    stepper.navigation.prev();
  };

  return (
    <>
      <div className='modal__content'>
        <div className='step step-3'>
          <div className='items__wrapper'>
            <ItemForm form={form} />
            <div className='divider' />
            <ItemsList form={form} />
          </div>
        </div>
      </div>

      <div className='modal__actions'>
        <span className='fs-16 fc-gray-600 truncate'>
          {stepper.state.current.index + 1} / {SELL_STEPS.length}
        </span>

        <div className='d-flex gap-2 a-center'>
          <Button
            type='button'
            text='Vissza'
            className='tertiary'
            onClick={prev}
          />

          <Button
            type='button'
            disabled={isBusy}
            text='Folytatás'
            className={`tertiary icon--reverse `}
            onClick={() => void next()}>
            <MoveRight />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ItemsStep;
