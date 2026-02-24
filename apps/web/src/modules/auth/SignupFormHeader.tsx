import { clearErroredFields } from "@bump/forms";
import { Fragment } from "react/jsx-runtime";
import type { SignupFormApi } from "../../hooks/auth/useSignupForm";
import { SIGNUP_FIELDS, type SignupStepId } from "../../wizards/signup/fields";
import { SIGNUP_STEPS, useSignupStepper } from "../../wizards/signup/stepper";

import { Check, ContactRound, User } from "lucide-react";

type SignupFormHeaderProps = {
  form: SignupFormApi;
  next: () => Promise<void>;
};

const ICONS: Record<SignupStepId, React.ReactNode> = {
  account: <User />,
  personal: <ContactRound />,
};

const SignupFormHeader = ({ form, next }: SignupFormHeaderProps) => {
  const stepper = useSignupStepper();

  const currentId = stepper.state.current.data.id as SignupStepId;

  // index helpers from Stepperize steps array
  const ids = SIGNUP_STEPS.map((s) => s.id) as SignupStepId[];
  const currentIndex = ids.indexOf(currentId);

  const handleClickStep = async (targetId: SignupStepId) => {
    if (targetId === currentId) return;

    const targetIndex = ids.indexOf(targetId);

    // BACK: always allowed
    if (targetIndex < currentIndex) {
      clearErroredFields(form, SIGNUP_FIELDS[currentId], {
        resetTouched: true,
      });

      stepper.navigation.goTo(targetId);
      return;
    }

    // FORWARD: run the same guard as "Next" button
    await next();
  };

  return (
    <div className='form__header'>
      {ids.map((id, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        const stepClassNames = [
          "form__step",
          isActive && "active",
          isCompleted && "valid",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Fragment key={id}>
            <div
              className={stepClassNames}
              role='button'
              tabIndex={0}
              onClick={() => void handleClickStep(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  void handleClickStep(id);
                }
              }}>
              <h3>{isCompleted ? <Check strokeWidth={3} /> : ICONS[id]}</h3>
              <h4>{SIGNUP_STEPS[index]?.title ?? id}</h4>
            </div>

            <span className={index < ids.length - 1 ? "form__divider" : ""} />
          </Fragment>
        );
      })}
    </div>
  );
};

export default SignupFormHeader;
