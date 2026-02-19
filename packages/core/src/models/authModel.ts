export type Role = 4001 | 5002 | 6003 | 7004;

export interface JwtPayload {
  user_id: string;
  username: string;
  account_role: Role;
  email?: string;
}

export interface AuthModel {
  accessToken: string;
  role: Role;

  user: {
    id: number;
    username: string;
  };
}

// Signup form adatai
export interface SignupModel {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: number | null;
}
