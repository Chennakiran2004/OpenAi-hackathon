/** Signup request body (POST /api/auth/signup/) */
export type SignupPayload = {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
  phone_number: string;
  age: number;
  gender: string;
  address: string;
};

/** Signup success response (201) */
export type SignupResponse = {
  success: boolean;
  message?: string;
  access: string;
  refresh: string;
};

/** Signin request body (POST /api/auth/signin/) */
export type SigninPayload = {
  email: string;
  password: string;
};

/** Signin success response (200) */
export type SigninResponse = {
  access: string;
  refresh: string;
};

/** User object returned by GET /api/auth/profile/ */
export type ProfileUser = {
  id: number;
  email: string;
  username: string;
  phone_number: string;
  age: number;
  gender: string;
  address: string;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
};

/** Profile success response (200) */
export type ProfileResponse = {
  success: boolean;
  user: ProfileUser;
};
