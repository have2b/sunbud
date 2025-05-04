"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hooks/useAuthStore";
import { loginSchema, LoginSchema } from "@/validations/auth.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Lock, User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const setAuth = useAuthStore((state) => state.setAuth);
  const [verificationError, setVerificationError] = useState<{
    show: boolean;
    email: string | null;
  }>({ show: false, email: null });

  const form = useForm<LoginSchema>({
    resolver: valibotResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await axios.post("/api/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setAuth(data.data, data.data.expiresIn);
      setVerificationError({ show: false, email: null });

      // Redirect back to the previous URL if available, otherwise go to homepage
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push("/");
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const response = error.response.data as {
          message?: string;
          data?: { email?: string };
        };
        const status = error.response.status;
        const msg = response?.message || (error as Error).message;

        // Handle verification error
        if (status === 403 && response?.data?.email) {
          setVerificationError({ show: true, email: response.data.email });
        } else {
          // Handle other errors
          toast.error(msg);
        }
      } else {
        // Handle non-axios errors
        toast.error((error as Error).message || "Có lỗi xảy ra khi đăng nhập");
      }
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post("/api/send-otp", { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        "Mã xác minh đã được gửi. Vui lòng kiểm tra email của bạn.",
      );
      router.push("/otp");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const msg = error.response.data?.message || (error as Error).message;
        toast.error(msg);
      } else {
        toast.error(
          (error as Error).message || "Có lỗi xảy ra khi gửi mã xác minh",
        );
      }
    },
  });

  const handleResendVerification = async () => {
    if (verificationError.email) {
      await resendVerificationMutation.mutateAsync(verificationError.email);
    }
  };

  async function onSubmit(request: LoginSchema) {
    setVerificationError({ show: false, email: null });
    await loginMutation.mutateAsync(request);
  }

  return (
    <Card className="w-full border-rose-100 p-4 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold text-rose-600">
          Chào mừng quay trở lại
        </CardTitle>
        <CardDescription className="text-center">
          Điền thông tin của bạn để đăng nhập vào trang web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verificationError.show && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">
              Tài khoản chưa xác minh
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              Vui lòng xác minh email trước khi đăng nhập.
              <Button
                variant="link"
                className="h-auto p-0 pl-1 font-medium text-amber-800 hover:text-amber-900"
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending}
              >
                {resendVerificationMutation.isPending
                  ? "Đang gửi..."
                  : "Gửi lại mã xác minh"}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="emailOrUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-600">
                    Email hoặc tên đăng nhập
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-2.5 left-3 size-5" />
                      <Input
                        placeholder="Email hoặc tên đăng nhập của bạn..."
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-600">
                    Mật khẩu
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-2.5 left-3 size-5" />
                      <Input
                        placeholder="Mật khẩu của bạn..."
                        {...field}
                        type="password"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700"
              disabled={
                loginMutation.isPending || resendVerificationMutation.isPending
              }
            >
              {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </motion.form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-muted-foreground text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-rose-600 hover:underline"
          >
            <span>Quên mật khẩu?</span>
          </Link>
        </div>
        <div className="text-center text-sm">
          <span>{"Không có tài khoản? "}</span>
          <Link
            href="/register"
            className="font-medium text-rose-600 hover:underline"
          >
            Đăng ký
          </Link>
        </div>
        <Button
          variant="outline"
          className="mt-2 w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-black"
          onClick={() => router.push("/")}
        >
          <span>Trở về trang chủ</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
