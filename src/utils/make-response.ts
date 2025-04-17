import { BaseResponse } from "@/types/common";

export function makeResponse(
  partial: Partial<BaseResponse> & { status: number }
): BaseResponse {
  return {
    status: partial.status,
    success: partial.success ?? (partial.status >= 200 && partial.status < 300),
    message: partial.message ?? "",
    data: partial.data ?? {},
  };
}
