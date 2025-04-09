import { BaseResponse } from "./base-response";

export interface RegisterParams {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
}

export class LoginRequest {
  constructor(public emailOrUsername: string, public password: string) {}
}

export type AuthUser = {
  id: string;
  role: string;
  username: string;
  name: string;
  avatarUrl?: string;
  expiresIn: number;
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

export class RegisterRequest {
  constructor(
    public username: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public password: string
  ) {}
}

export class RegisterResponse extends BaseResponse {
  constructor(
    public success: boolean,
    public data?: object,
    public message?: string
  ) {
    super(success, data, message);
  }
}
