import FormBase, { type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

import Password from "../components/Password";

type FormPasswordProps = FormControlProps & {
  placeholder?: string;
  tabIndex?: number;
};

const FormPassword = (props: FormPasswordProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Password
        name={field.name}
        required={props.required}
        placeholder={props.placeholder}
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        isInvalid={isInvalid}
        tabIndex={props.tabIndex}
      />
    </FormBase>
  );
};

export default FormPassword;
