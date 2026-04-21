import type { AuthModel } from "@bump/core/models";
import { useMemo, useState } from "react";
import { AuthContext } from "./context";
import type { AuthProviderProps } from "./types";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthModel | null>(null);
  const [didLogout, setDidLogout] = useState<boolean>(false);

  const value = useMemo(
    () => ({ auth, setAuth, didLogout, setDidLogout }),
    [auth, didLogout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;
