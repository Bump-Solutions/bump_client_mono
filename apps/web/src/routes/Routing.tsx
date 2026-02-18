import { Suspense, type JSX, type LazyExoticComponent } from "react";

import Fallback from "../components/Fallback";

const withSuspense = (Component: LazyExoticComponent<any>) => {
  return (
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  );
};

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

export const publicRoutes = () => {
  return (
    <>
      {/* AUTHENTICATION 
      <Route path='/auth' element={withSuspense(Authentication)}></Route>

      <Route
        path='/auth/google/callback'
        element={withSuspense(GoogleCallback)}
      />
      */}
    </>
  );
};

export const privateRoutes = () => {
  return <></>;
};

export const errorRoutes = () => {
  return <></>;
};

export const modalRoutes = (background: Location) => {
  return <></>;
};
