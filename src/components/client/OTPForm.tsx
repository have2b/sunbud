"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const OTPForm = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [expired, setExpired] = useState<boolean>(false);

  const startCountdown = (initialSeconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(initialSeconds);
    setExpired(initialSeconds <= 0);
    if (initialSeconds > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    const expiryStr = localStorage.getItem("otpExpiry");
    if (expiryStr) {
      const expiry = Number(expiryStr);
      const initialSeconds = Math.ceil((expiry - Date.now()) / 1000);
      startCountdown(initialSeconds > 0 ? initialSeconds : 0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { otp: string }) => {
      const response = await axios.post("/api/verify-otp", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      localStorage.removeItem("otpExpiry");
      localStorage.removeItem("userEmail");
      router.push("/login");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (expired) {
      toast.error("OTP đã hết hạn, vui lòng gửi lại OTP");
      return;
    }
    await verifyOtpMutation.mutateAsync({ otp });
  };

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const email = localStorage.getItem("userEmail");
      const response = await axios.post("/api/send-otp", { email });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      const newExpiry = data.data.otpExpiry;
      localStorage.setItem("otpExpiry", newExpiry.toString());
      startCountdown(Math.ceil((newExpiry - Date.now()) / 1000));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  return (
    <Card className="w-full border-rose-100 p-4 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold text-rose-600">
          Xác nhận mã OTP
        </CardTitle>
        <CardDescription className="text-center">
          Nhập mã OTP 6 ký tự đã được gửi đến email của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              >
                <InputOTPGroup className="space-x-2">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700"
            disabled={verifyOtpMutation.isPending}
          >
            {verifyOtpMutation.isPending ? "Đang xác thực..." : "Xác thực"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <Button
            variant="link"
            className="h-auto p-0 text-rose-600 hover:underline"
            disabled={secondsLeft > 0 || resendOtpMutation.isPending}
            onClick={() => resendOtpMutation.mutate()}
          >
            {resendOtpMutation.isPending
              ? "Đang gửi lại..."
              : secondsLeft > 0
                ? `Gửi lại OTP (${secondsLeft}s)`
                : "Gửi lại OTP"}
          </Button>
        </div>
        <Button
          variant="outline"
          className="mt-2 w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-black"
          onClick={() => router.push("/")}
        >
          Trở về trang chủ
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OTPForm;
