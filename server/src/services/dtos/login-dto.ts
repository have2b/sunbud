import { BaseResponse } from "./base-response";

export class LoginDto {
  constructor(public emailOrUsername: string, public password: string) {}
}

export class LoginResponse extends BaseResponse {
  constructor(
    public success: boolean,
    public data?: object,
    public message?: string
  ) {
    super(success, data, message);
  }
}
