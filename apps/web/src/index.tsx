import "./styles/css/button.css";
import "./styles/css/empty.css";
import "./styles/css/index.css";
import "./styles/css/input.css";
import "./styles/css/toast.css";
import "./styles/css/tooltip.css";

import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Route, BrowserRouter as Router, Routes } from "react-router";

import { Toaster } from "sonner";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

import App from "./App.tsx";

import AuthProvider from "./context/auth/AuthProvider.tsx";
import NavbarThemeProvider from "./context/navbartheme/NavbarThemeProvider.tsx";
import ThemeProvider from "./context/theme/ThemeProvider.tsx";

import {
  CircleCheck,
  Info,
  Loader,
  OctagonX,
  TriangleAlert,
} from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 1s, 2s, 4s, 8s, 10s (max)
    },
  },
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <AuthProvider>
              <NavbarThemeProvider>
                {createPortal(
                  <Toaster
                    position='bottom-right'
                    className='toaster'
                    theme='light'
                    richColors
                    icons={{
                      success: <CircleCheck />,
                      error: <OctagonX />,
                      info: <Info />,
                      warning: <TriangleAlert />,
                      loading: <Loader />,
                    }}
                    toastOptions={{
                      className: "toast",
                      classNames: {
                        success: "toast--success",
                        error: "toast--error",
                        info: "toast--info",
                        warning: "toast--warning",
                        loading: "toast--loading",
                      },
                    }}
                    visibleToasts={5}
                    duration={5000}
                  />,
                  document.body,
                )}

                <Routes>
                  <Route path='/*' element={<App />} />
                </Routes>
              </NavbarThemeProvider>
            </AuthProvider>
          </QueryParamProvider>
        </Router>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </ThemeProvider>,
);
