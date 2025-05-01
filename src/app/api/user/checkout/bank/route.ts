import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { NextRequest, NextResponse } from "next/server";
import {
  consoleLogger,
  dateFormat,
  HashAlgorithm,
  ProductCode,
  VNPay,
  VnpCurrCode,
  VnpLocale,
} from "vnpay";

const timeZone = "Asia/Bangkok"; // GMT+7

export async function POST(request: NextRequest) {
  const { amount } = await request.json();
  const { vnp_TmnCode, vnp_HashSecret } = process.env;

  const afterTenMins = new Date();
  afterTenMins.setMinutes(afterTenMins.getMinutes() + 10);

  const vnp_Amount = Math.floor(amount);
  const vnp_OrderInfo = "Thanh toán đơn hàng";

  const vnp_CreateDate = dateFormat(toZonedTime(new Date(), timeZone));
  const vnp_ExpireDate = dateFormat(toZonedTime(afterTenMins, timeZone));

  const vnp_IpAddr = request.headers.get("x-forwarded-for") || "";
  const vnp_TxnRef = format(toZonedTime(new Date(), timeZone), "HHmmss");
  const origin =
    request.headers.get("origin") ||
    request.headers.get("referer") ||
    "http://localhost:3000";
  const vnp_ReturnUrl = new URL(origin).origin + "/verify-payment";

  const vnpay = new VNPay({
    tmnCode: vnp_TmnCode!,
    secureSecret: vnp_HashSecret!,
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: true,
  });

  const paymentUrl = vnpay.buildPaymentUrl(
    {
      vnp_Amount,
      vnp_IpAddr,
      vnp_TxnRef,
      vnp_OrderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl,
      vnp_Locale: VnpLocale.VN,
      vnp_CurrCode: VnpCurrCode.VND,
      vnp_CreateDate,
      vnp_ExpireDate,
    },
    {
      logger: {
        type: "all",
        loggerFn: consoleLogger,
      },
    },
  );

  return NextResponse.json({ paymentUrl });
}
