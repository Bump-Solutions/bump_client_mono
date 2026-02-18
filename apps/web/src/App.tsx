import { Suspense } from "react";
import { Routes, useLocation } from "react-router";

import Fallback from "./components/Fallback";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <Suspense fallback={<Fallback />}>
      {/* Main Routes */}
      <Routes location={background || location}></Routes>

      {/* Modal Routes */}
      {background && <Routes></Routes>}
    </Suspense>
  );
}

export default App;
