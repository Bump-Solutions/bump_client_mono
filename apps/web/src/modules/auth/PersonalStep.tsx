import { clearErroredFields } from "@bump/forms";
import { ENUM } from "@bump/utils";
import { SIGNUP_FIELDS } from "../../wizards/signup/fields";

import { useStore } from "@tanstack/react-form";
import type { MouseEvent } from "react";
import type { SignupFormApi } from "../../hooks/auth/useSignupForm";
import { signupPersonalStepSchema } from "../../schemas/signupWizard";
import { useSignupStepper } from "../../wizards/signup/stepper";

import Button from "../../components/Button";
import StateButton from "../../components/StateButton";
import FieldGroup from "../../forms/FieldGroup";

import { ClipboardPen, MoveLeft } from "lucide-react";

type PersonalStepProps = {
  form: SignupFormApi;
  next: () => Promise<void>;
};

const PersonalStep = ({ form, next }: PersonalStepProps) => {
  const stepper = useSignupStepper();

  const isBusy = useStore(
    form.store,
    (state) =>
      state.isValidating || state.isFormValidating || state.isFieldsValidating,
  );

  const prev = () => {
    clearErroredFields(form, SIGNUP_FIELDS.personal, { resetTouched: true });
    stepper.navigation.prev();
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // SignupForm.next() already:
    // - touches fields for current step
    // - validates fields
    // - validates Zod section
    // - and calls form.handleSubmit() when last
    await next();
  };

  return (
    <>
      <div className='form__inputs'>
        {/* Last name + first name */}
        <FieldGroup columns={2}>
          <form.AppField
            name='personal.lastName'
            validators={{
              onChange: signupPersonalStepSchema.shape.lastName,
            }}>
            {(field) => (
              <field.Input
                type='text'
                label='Vezetéknév'
                required
                placeholder='Vezetéknév'
                tabIndex={1}
                autoFocus
              />
            )}
          </form.AppField>

          <form.AppField
            name='personal.firstName'
            validators={{
              onChange: signupPersonalStepSchema.shape.firstName,
            }}>
            {(field) => (
              <field.Input
                type='text'
                label='Keresztnév'
                required
                placeholder='Keresztnév'
                tabIndex={2}
              />
            )}
          </form.AppField>
        </FieldGroup>

        <form.AppField
          name='personal.phoneNumber'
          validators={{ onChange: signupPersonalStepSchema.shape.phoneNumber }}>
          {(field) => (
            <field.Phone
              label='Mobil telefonszám'
              required
              placeholder='+3630-123-4567'
              tabIndex={3}
            />
          )}
        </form.AppField>

        <form.AppField
          name='personal.gender'
          validators={{ onChange: signupPersonalStepSchema.shape.gender }}>
          {(field) => (
            <field.Select
              label='Nem'
              options={ENUM.AUTH.GENDER_OPTIONS}
              tabIndex={4}
            />
          )}
        </form.AppField>
      </div>

      <div className='form__buttons'>
        <Button
          type='button'
          onClick={prev}
          text='Vissza'
          className='tertiary'
          tabIndex={4}>
          <MoveLeft />
        </Button>

        <StateButton
          type='button'
          onClick={handleSubmit}
          text='Regisztráció'
          className='primary'
          tabIndex={5}
          disabled={isBusy}>
          <ClipboardPen />
        </StateButton>
      </div>
    </>
  );
};

export default PersonalStep;
