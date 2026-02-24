import "../../styles/css/multistepform.css";

import { touchFields, validateFields, validateZodSection } from "@bump/forms";

import { toast } from "sonner";
import { useSignupForm } from "../../hooks/auth/useSignupForm";
import { SIGNUP_FIELDS } from "../../wizards/signup/fields";
import { useSignupStepper } from "../../wizards/signup/stepper";

import AccountStep from "./AccountStep";
import PersonalStep from "./PersonalStep";
import SignupFormHeader from "./SignupFormHeader";

const SignupForm = () => {
  const form = useSignupForm();

  const stepper = useSignupStepper();
  const stepId = stepper.state.current.data.id;
  const stepData = stepper.state.current.data;

  const next = async (): Promise<void> => {
    const fields = SIGNUP_FIELDS[stepId];
    touchFields(form, fields);
    await validateFields(form, fields, "submit");

    const basePath = stepData.basePath as "account" | "personal";
    const schema = stepData.schema;
    const sectionValue = form.state.values[basePath];

    const result = validateZodSection(form, basePath, sectionValue, schema, {
      writeToMeta: true,
    });
    if (!result.ok) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      throw new Error("Invalid form submission");
    }

    if (!stepper.state.isLast) {
      stepper.navigation.next();
    } else {
      form.handleSubmit();
    }
  };

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
