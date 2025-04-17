import { JWTPayload } from "jose";

export class LoginResponseDto {
  fullName: string;
  email: string;
  username: string;
  phone: string;
  avatarUrl: string | null;
  role: string;

  constructor(data: LoginResponseDto) {
    this.fullName = data.fullName;
    this.email = data.email;
    this.username = data.username;
    this.phone = data.phone;
    this.avatarUrl = data.avatarUrl;
    this.role = data.role;
  }
}

export interface AuthState {
  user: LoginResponseDto | null;
  expiresAt: number | null;
  setAuth: (user: LoginResponseDto, expiresIn: number) => void;
  clearAuth: () => void;
}

export interface TokenPayload extends JWTPayload {
  userId: string;
  role: string;
}
