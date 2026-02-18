import "./styles/css/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Route, BrowserRouter as Router, Routes } from "react-router";

import App from "./App.tsx";
import ThemeProvider from "./context/theme/ThemeProvider.tsx";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Router>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>,
);
