import { ROUTES } from "../../routes/routes";

import { loginRequestSchema } from "@bump/core/schemas";
import { Link } from "react-router";
import { useLoginForm } from "../../hooks/auth/useLoginForm";

import StateButton from "../../components/StateButton";

import { LogIn } from "lucide-react";

const LoginForm = () => {
  const form = useLoginForm();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}>
      {/* Email */}
      <form.AppField
        name='email'
        validators={{ onChange: loginRequestSchema.shape.email }}>
        {(field) => (
          <field.Input
            type='email'
            label='E-Mail'
            required
            placeholder='minta@mail.com'
            tabIndex={1}
          />
        )}
      </form.AppField>

      {/* Password */}
      <form.AppField
        name='password'
        validators={{ onChange: loginRequestSchema.shape.password }}>
        {(field) => (
          <field.Password
            label='Jelszó'
            required
            placeholder='Mintajelszo12345'
            tabIndex={2}
          />
        )}
      </form.AppField>

      <Link to={ROUTES.LOGIN} className='link' tabIndex={3}>
        Elfelejtetted a jelszavadat?
      </Link>

      <StateButton
        type='button'
        onClick={form.handleSubmit}
        text='Bejelentkezés'
        className='primary'
        tabIndex={4}>
        <LogIn />
      </StateButton>
    </form>
  );
};

export default LoginForm;
