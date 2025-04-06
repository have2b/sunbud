export interface LoginResponse {
  success: boolean;
  data: AuthUser;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  avatar_url: string | null;
  role: string;
  expires_in: number;
}

export interface AuthState {
  user: AuthUser | null;
  expiresAt: number | null;
  setAuth: (user: AuthUser, expiresIn: number) => void;
  clearAuth: () => void;
}
