import { ENUM } from "@bump/utils";
import { Link } from "react-router";
import { useTitle } from "react-use";
import { ROUTES } from "../../routes/routes";

import { SignupScoped } from "../../wizards/signup/stepper";

import SignupForm from "./SignupForm";
import SocialSignup from "./SocialSignup";

const Signup = () => {
  useTitle(`Regisztráció - ${ENUM.BRAND.NAME}`);

  return (
    <div className='signup'>
      <h1>Vágj bele most!</h1>
      <SocialSignup />

      <div className='bg-line'>
        <h4>vagy</h4>
      </div>

      <SignupScoped initialStep='account'>
        <SignupForm />
      </SignupScoped>

      <p className=' mt-2 ta-center fs-18'>
        Már van fiókod?{" "}
        <Link to={ROUTES.LOGIN} className='link' tabIndex={5}>
          Jelentkezz be.
        </Link>
      </p>
    </div>
  );
};

export default Signup;
