import { useStore } from "@tanstack/react-form";
import type { SignupFormApi } from "../../hooks/auth/useSignupForm";
import { signupAccountStepSchema } from "../../schemas/signupWizard";

import Button from "../../components/Button";
import FieldGroup from "../../forms/FieldGroup";

import { MoveRight } from "lucide-react";

type AccountStepProps = {
  form: SignupFormApi;
  next: () => Promise<void>;
};

const AccountStep = ({ form, next }: AccountStepProps) => {
  const isBusy = useStore(
    form.store,
    (state) =>
      state.isValidating || state.isFormValidating || state.isFieldsValidating,
  );

  return (
    <>
      <div className='form__inputs'>
        {/* E-mail */}
        <form.AppField
          name='account.email'
          validators={{
            onChange: signupAccountStepSchema.shape.email,
          }}>
          {(field) => (
            <field.Input
              type='email'
              label='E-mail'
              required
              placeholder='minta@email.com'
              tabIndex={1}
              autoFocus
            />
          )}
        </form.AppField>

        {/* Username */}
        <form.AppField
          name='account.username'
          validators={{
            onChange: signupAccountStepSchema.shape.username,
          }}>
          {(field) => (
            <field.Input
              type='text'
              label='Felhasználónév'
              required
              placeholder='minta2025'
              tabIndex={2}
            />
          )}
        </form.AppField>

        {/* Password + confirmation */}
        <FieldGroup columns={2}>
          <form.AppField
            name='account.password'
            validators={{
              onChange: signupAccountStepSchema.shape.password,
            }}>
            {(field) => (
              <field.Password
                label='Jelszó'
                required
                placeholder='********'
                tabIndex={3}
              />
            )}
          </form.AppField>

          <form.AppField
            name='account.passwordConfirmation'
            validators={{
              // revalidate when password changes
              onChangeListenTo: ["account.password"],
              onChange: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue(
                  "account.password",
                ) as string;

                if (!value) return "A mező kitöltése kötelező.";
                if (password && value !== password)
                  return "A jelszavak nem egyeznek.";

                return undefined;
              },
            }}>
            {(field) => (
              <field.Password
                label='Jelszó újra'
                required
                placeholder='********'
                tabIndex={4}
              />
            )}
          </form.AppField>
        </FieldGroup>
      </div>

      <div className='form__buttons'>
        <Button
          type='button'
          disabled={isBusy}
          onClick={() => void next()}
          text='Következő'
          className='primary'
          tabIndex={5}>
          <MoveRight />
        </Button>
      </div>
    </>
  );
};

export default AccountStep;
