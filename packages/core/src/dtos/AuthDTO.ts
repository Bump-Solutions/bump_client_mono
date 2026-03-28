/**
 * A backend LOGIN végpontjára küldött kéréselem.
 * Pontosan azokat a mezőket tartalmazza, amit a szerver elvár.
 */
export interface LoginRequestDTO {
  email: string;
  password: string;
}

/**
 * A backend LOGIN válaszában érkező adatok.
 * Tartalmazza a JWT tokent és az email címet.
 */
export interface LoginResponseDTO {
  access_token: string;
  email: string;
}

export interface LoginMobileResponseDTO {
  access_token: string;
  refresh_token: string;
}

/**
 * A backend REGISZTRÁCIÓ (SIGNUP) végpontjára küldött kéréselem.
 */
export interface SignupRequestDTO {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: number | null;
}

export interface GoogleResponseDTO {
  access_token: string;
}
