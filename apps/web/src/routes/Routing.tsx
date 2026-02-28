import { ENUM } from "@bump/utils";
import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

import { Outlet, Route } from "react-router";

import CartProvider from "../context/cart/CartProvider";

import Fallback from "../components/Fallback";
import PersistLogin from "../modules/auth/PersistLogin";
import RequireAuth from "../modules/auth/RequireAuth";

import Home from "../modules/home/Home";
import Main from "../modules/home/Main";

const Authentication = lazy(() => import("../modules/auth/Authentication"));
const Login = lazy(() => import("../modules/auth/Login"));
const Signup = lazy(() => import("../modules/auth/Signup"));
const GoogleCallback = lazy(() => import("../modules/auth/GoogleCallback"));

const Cart = lazy(() => import("../modules/cart/Cart"));

const Orders = lazy(() => import("../modules/order/Orders"));

const withSuspense = (
  Component: LazyExoticComponent<ComponentType<unknown>>,
) => {
  return (
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  );
};

/*
const withSuspenseProps = <T extends object>(
  Component: LazyExoticComponent<(props: T) => JSX.Element>,
  props: T,
) => {
  return (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
};
*/

export const publicRoutes = () => {
  return (
    <>
      {/* AUTHENTICATION */}
      <Route path='/auth' element={withSuspense(Authentication)}>
        <Route index element={<Login />} />
        <Route path='signup' element={<Signup />} />
      </Route>

      <Route
        path='/auth/google/callback'
        element={withSuspense(GoogleCallback)}
      />
    </>
  );
};

export const privateRoutes = () => {
  return (
    <>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={ENUM.AUTH.ROLES.All} />}>
          {/* PROVIDERS FOR AUTHENTICATED USERS */}
          <Route
            element={
              <CartProvider>
                <Outlet />
              </CartProvider>
            }>
            {/* HOME */}
            <Route path='/' element={<Main />}>
              <Route index element={<Home />} />

              {/* CART */}
              <Route path='/cart' element={withSuspense(Cart)} />

              {/* ORDERS */}
              <Route path='/orders' element={withSuspense(Orders)} />
            </Route>
          </Route>
        </Route>
      </Route>
    </>
  );
};

export const errorRoutes = () => {
  return <></>;
};

export const modalRoutes = (background: Location) => {
  return (
    <>
      <Route element={<PersistLogin />}>
        <Route
          element={<RequireAuth allowedRoles={ENUM.AUTH.ROLES.Validated} />}>
          {/* PROVIDERS FOR AUTHENTICATED USERS */}
          <Route
            element={
              <CartProvider>
                <Outlet />
              </CartProvider>
            }>
            {/* SELL */}
          </Route>
        </Route>
      </Route>
    </>
  );
};
