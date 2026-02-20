import { ENUM } from "@bump/utils";
import { ROUTES } from "../../routes/routes";

import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useTitle } from "react-use";
import { BooleanParam, useQueryParam } from "use-query-params";

import { motion } from "framer-motion";

import LoginForm from "./LoginForm";
import SocialSignup from "./SocialSignup";

const Login = () => {
  useTitle(`Bejelentkezés - ${ENUM.BRAND.NAME}`);

  const [showForgotPassword] = useQueryParam("forgotPassword", BooleanParam);

  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <>
      {!showForgotPassword ? (
        <motion.div
          key='login'
          initial={{ x: "-100%" }}
          animate={{ x: "0" }}
          exit={{ x: showForgotPassword ? "-100%" : "100%" }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className='login'>
          <h1>Jó, hogy újra látunk!</h1>

          <SocialSignup />

          <div className='bg-line'>
            <h4>vagy</h4>
          </div>

          <LoginForm />

          <p className='mt-2 ta-center fs-18'>
            Még nincs fiókod?{" "}
            <Link to={ROUTES.SIGNUP} className='link' tabIndex={5}>
              Regisztrálj ingyen.
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.div
          key='forgot'
          initial={{ x: "100%" }}
          animate={{ x: "0" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
          {/* ForgotPassword komponens */}
        </motion.div>
      )}
    </>
  );
};

export default Login;
