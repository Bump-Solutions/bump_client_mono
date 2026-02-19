import { useState } from "react";
import { AuthContext } from "./context";
import type { AuthProviderProps } from "./types";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  return <AuthContext value={{ auth, setAuth }}>{children}</AuthContext>;
};

export default AuthProvider;
