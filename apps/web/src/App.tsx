import { Suspense } from "react";
import { Routes, useLocation } from "react-router";

import Fallback from "./components/Fallback";

import {
  errorRoutes,
  modalRoutes,
  privateRoutes,
  publicRoutes,
} from "./routes/Routing";
import { API } from "./utils/api";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  console.log(import.meta.env.VITE_API_ORIGIN, API.BASE_URL);

  return (
    <Suspense fallback={<Fallback />}>
      {/* Main Routes */}
      <Routes location={background || location}>
        {/* Public Routes */}
        {publicRoutes()}

        {/* Private Routes */}
        {privateRoutes()}

        {/* Catch all */}
        {errorRoutes()}
      </Routes>

      {/* Modal Routes */}
      {background && <Routes>{modalRoutes(background)}</Routes>}
    </Suspense>
  );
}

export default App;
