import { ROUTES } from "../../routes/routes";

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { useLoginWithGoogle } from "../../hooks/auth/useLoginWithGoogle";

import Spinner from "../../components/Spinner";

const GoogleCallback = () => {
  const [params] = useSearchParams();
  const code = params.get("code");

  const navigate = useNavigate();
  const googleLoginMutation = useLoginWithGoogle();

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!code) {
      toast.error("Hiányzó Google authorization code.");
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    const promise = googleLoginMutation.mutateAsync(code);

    toast.promise(promise, {
      loading: "Bejelentkezés folyamatban...",
      success: "Bejelentkeztél.",
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba történt a Google-lal való bejelentkezés során.",
    });

    // Only handle failure navigation here (success navigation is in mutation onSuccess)
    promise.catch(() => navigate(ROUTES.LOGIN, { replace: true }));
  }, [code, googleLoginMutation, navigate]);

  return <Spinner />;
};

export default GoogleCallback;
