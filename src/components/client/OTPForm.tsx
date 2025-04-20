"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const OTPForm = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const expiry = Number(localStorage.getItem("otpExpiry"));
    const diff = Math.ceil((expiry - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  });
  const [expired, setExpired] = useState<boolean>(() => secondsLeft <= 0);

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
    startCountdown(secondsLeft);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [secondsLeft]);

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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-full max-w-xs flex-col items-center rounded-lg bg-white p-4 shadow-md sm:max-w-md sm:p-6"
    >
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Xác nhận mã OTP
      </h2>
      <InputOTP
        value={otp}
        onChange={(value) => setOtp(value)}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        className="justify-center"
      >
        <InputOTPGroup className="space-x-2 sm:space-x-4">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="mt-6 w-full rounded-lg bg-indigo-600 py-2 text-white transition-all hover:bg-indigo-700"
        disabled={verifyOtpMutation.isPending}
      >
        {verifyOtpMutation.isPending ? "Đang xác thực..." : "Xác thực"}
      </motion.button>
      <button
        type="button"
        disabled={secondsLeft > 0 || resendOtpMutation.isPending}
        onClick={() => resendOtpMutation.mutate()}
        className="mt-4 text-sm text-blue-600 hover:underline disabled:text-gray-400"
      >
        {resendOtpMutation.isPending
          ? "Đang gửi lại..."
          : secondsLeft > 0
            ? `Gửi lại OTP (${secondsLeft}s)`
            : "Gửi lại OTP"}
      </button>
    </motion.form>
  );
};

export default OTPForm;
