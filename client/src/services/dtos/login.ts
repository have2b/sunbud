export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
  };
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}
