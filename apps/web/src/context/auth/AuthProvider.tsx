import type { AuthModel } from "@bump/core/models";
import { useState } from "react";
import { AuthContext } from "./context";
import type { AuthProviderProps } from "./types";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthModel | null>(null);

  return <AuthContext value={{ auth, setAuth }}>{children}</AuthContext>;
};

export default AuthProvider;
