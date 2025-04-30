import { createHash } from "crypto";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

type PaymentParams = {
  vnp_Amount: number;
  vnp_Command?: string;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_ExpireDate: string;
  vnp_IpAddr: string;
  vnp_Locale?: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_ReturnUrl: string;
  vnp_TmnCode?: string;
  vnp_TxnRef: string;
  vnp_Version?: string;
  vnp_BankCode?: string;
  [key: string]: string | number | undefined;
};

export async function POST(request: NextRequest) {
  const { amount } = await request.json();
  const {
    vnp_TmnCode,
    vnp_HashSecret,
    vnp_Url,
    vnp_Command,
    vnp_Version,
    vnp_Locale,
  } = process.env;

  const vnp_Amount = amount * 100;
  const vnp_OrderInfo = "Thanh toán đơn hàng";
  const vnp_OrderType = "other";
  const vnp_CreateDate = format(new Date(), "yyyyMMddHHmmss");
  const vnp_IpAddr = request.headers.get("x-forwarded-for") || "";
  const vnp_TxnRef = format(new Date(), "HHmmss");
  const vnp_BankCode = "VNPAYQR";
  const vnp_CurrCode = "VND";
  // Extract origin from request for dynamic return URL
  const origin =
    request.headers.get("origin") ||
    request.headers.get("referer") ||
    "http://localhost:3000";
  const vnp_ReturnUrl = new URL(origin).origin + "/";
  const vnp_ExpireDate = format(
    new Date(Date.now() + 10 * 60 * 1000),
    "yyyyMMddHHmmss",
  );

  // Create a sorted payment parameter object without the hash secret
  const paymentParams: PaymentParams = {
    vnp_Amount,
    vnp_Command,
    vnp_CreateDate,
    vnp_CurrCode,
    vnp_ExpireDate,
    vnp_IpAddr,
    vnp_Locale,
    vnp_OrderInfo,
    vnp_OrderType,
    vnp_ReturnUrl,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_Version,
  };

  console.log("--------------------------");
  console.log("vnp_ExpireDate: ", vnp_ExpireDate);
  console.log("vnp_CreateDate: ", vnp_CreateDate);
  console.log("--------------------------");

  if (vnp_BankCode) {
    paymentParams.vnp_BankCode = vnp_BankCode;
  }

  // Sort parameters by key before hashing
  const sortedParams = Object.keys(paymentParams)
    .sort()
    .reduce<PaymentParams>((acc, key) => {
      const typedKey = key as keyof PaymentParams;
      acc[typedKey] = paymentParams[typedKey];
      return acc;
    }, {} as PaymentParams);

  // Create the secure hash with sorted parameters
  const secureHashData = Object.entries(sortedParams)
    .map(([key, value]) => {
      // Only encode if value is defined
      return `${key}=${value !== undefined ? encodeURIComponent(String(value)) : ""}`;
    })
    .join("&");

  const vnp_SecureHash = createHash("sha256")
    .update(vnp_HashSecret + secureHashData)
    .digest("hex");

  // Add secure hash to parameters
  const finalParams = {
    ...sortedParams,
    vnp_SecureHash,
  };

  // Build the final URL
  const vnpUrl = `${vnp_Url}?${Object.entries(finalParams)
    .map(([key, value]) => {
      // Only encode if value is defined
      return `${key}=${value !== undefined ? encodeURIComponent(String(value)) : ""}`;
    })
    .join("&")}`;

  // Return the URL to the client instead of redirecting
  return NextResponse.json({ paymentUrl: vnpUrl });
}
