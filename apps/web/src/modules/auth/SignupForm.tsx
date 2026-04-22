import "@/styles/css/multistepform.css";

import { useWizardStepAdvance } from "@/forms/useWizardStepAdvance";
import { useSignupForm } from "@/hooks/auth/useSignupForm";
import { SIGNUP_FIELDS } from "@/wizards/signup/fields";
import { useSignupStepper } from "@/wizards/signup/stepper";

import AccountStep from "./AccountStep";
import PersonalStep from "./PersonalStep";
import SignupFormHeader from "./SignupFormHeader";

const SignupForm = () => {
  const form = useSignupForm();

  const stepper = useSignupStepper();
  const stepId = stepper.state.current.data.id;
  const stepData = stepper.state.current.data;

  const next = useWizardStepAdvance(
    form,
    stepper,
    SIGNUP_FIELDS[stepId],
    stepData.basePath,
    stepData.schema,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className='multi-step-form'>
      <SignupFormHeader form={form} next={next} />

      <div className='form__body'>
        {stepper.flow.switch({
          account: () => <AccountStep form={form} next={next} />,
          personal: () => <PersonalStep form={form} next={next} />,
        })}
      </div>
    </form>
  );
};

export default SignupForm;
