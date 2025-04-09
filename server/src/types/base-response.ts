export class BaseResponse {
  constructor(
    public success: boolean,
    public data?: object,
    public message?: string
  ) {}
}
