export interface RegisterResponse {
  success: boolean;
  data?: object;
}

export interface RegisterRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
