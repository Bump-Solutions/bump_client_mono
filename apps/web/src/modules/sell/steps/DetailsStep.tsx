import { clearErroredFields } from "@bump/forms";
import { useStore } from "@tanstack/react-form";
import type { SellFormApi } from "../../../hooks/sell/useSellForm";
import { sellDetailsStepSchema } from "../../../schemas/sellWizard";
import { SELL_FIELDS } from "../../../wizards/sell/fields";
import { SELL_STEPS, useSellStepper } from "../../../wizards/sell/stepper";

import Button from "../../../components/Button";
import BrandChips from "../chips/BrandChips";
import ColorwayChips from "../chips/ColorwayChips";
import ModelChips from "../chips/ModelChips";

import { MoveRight } from "lucide-react";

type DetailsStepProps = {
  form: SellFormApi;
  next: () => Promise<void>;
};

const DetailsStep = ({ form, next }: DetailsStepProps) => {
  const stepper = useSellStepper();

  const isBusy = useStore(
    form.store,
    (state) =>
      state.isValidating || state.isFormValidating || state.isFieldsValidating,
  );

  const isCatalog = useStore(
    form.store,
    (state) => state.values.select.isCatalog,
  );

  const prev = () => {
    clearErroredFields(form, SELL_FIELDS.details, { resetTouched: true });
    stepper.navigation.prev();
  };

  return (
    <>
      <div className='modal__content'>
        <div className='step step-2'>
          <div
            className={`details__wrapper ${isCatalog ? "catalog" : "custom"}`}>
            {/* Cím */}
            <form.AppField
              name='details.title'
              validators={{
                onChange: sellDetailsStepSchema.shape.title,
              }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Cím'
                  required
                  placeholder='pl. Nike Air Force 1 Triple White'
                  autoFocus
                  tabIndex={0}
                />
              )}
            </form.AppField>

            {/* Leírás */}
            <form.AppField
              name='details.description'
              validators={{
                onChange: sellDetailsStepSchema.shape.description,
              }}>
              {(field) => (
                <field.TextArea
                  label='Leírás'
                  placeholder='pl. Eladó Nike Force 1, 42-es méretben, jó állapotban.'
                  tabIndex={1}
                  maxLength={500}
                  rows={4}
                />
              )}
            </form.AppField>

            {isCatalog ? (
              <>
                {/* Márka */}
                <BrandChips form={form} />
                {/* Modell */}
                <ModelChips form={form} />
                {/* Színállás */}
                <ColorwayChips form={form} />
              </>
            ) : (
              <>
                {/* Márka */}
                <form.AppField
                  name='details.product.brand'
                  validators={{
                    onChange: sellDetailsStepSchema.shape.product.shape.brand,
                  }}>
                  {(field) => (
                    <field.Input
                      type='text'
                      label='Márka'
                      required
                      placeholder='pl. Nike'
                      tabIndex={2}
                    />
                  )}
                </form.AppField>

                {/* Modell */}
                <form.AppField
                  name='details.product.model'
                  validators={{
                    onChange: sellDetailsStepSchema.shape.product.shape.model,
                  }}>
                  {(field) => (
                    <field.Input
                      type='text'
                      label='Modell'
                      required
                      placeholder='pl. Air Force 1'
                      tabIndex={3}
                    />
                  )}
                </form.AppField>

                {/* Színállás */}
                <form.AppField
                  name='details.product.colorWay'
                  validators={{
                    onChange:
                      sellDetailsStepSchema.shape.product.shape.colorWay,
                  }}>
                  {(field) => (
                    <field.Input
                      type='text'
                      label='Színállás'
                      required
                      placeholder='pl. Triple White'
                      tabIndex={4}
                    />
                  )}
                </form.AppField>
              </>
            )}
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

export default DetailsStep;
