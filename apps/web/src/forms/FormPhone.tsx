import FormBase, { type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

import Phone from "../components/Phone";

type FormPhone = FormControlProps & {
  placeholder?: string;

  autoFocus?: boolean;
  tabIndex?: number;
};

const FormPhone = (props: FormPhone) => {
  const field = useFieldContext<string>();

  const success = Boolean(field.state.value) && field.state.meta.isValid;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Phone
        name={field.name}
        required={props.required}
        placeholder={props.placeholder}
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        success={success}
        isInvalid={isInvalid}
        autoFocus={props.autoFocus}
        tabIndex={props.tabIndex}
      />
    </FormBase>
  );
};

export default FormPhone;
