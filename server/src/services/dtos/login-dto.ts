import { BaseResponse } from "./base-response";

export class LoginRequest {
  constructor(public emailOrUsername: string, public password: string) {}
}

export type AuthUser = {
  id: number;
  role: string;
  username: string;
  name: string;
  avatar_url?: string;
  expires_in: number;
  token: string;
};

export class LoginResponse extends BaseResponse {
  constructor(
    public success: boolean,
    public data?: AuthUser,
    public message?: string
  ) {
    super(success, data, message);
  }
}
