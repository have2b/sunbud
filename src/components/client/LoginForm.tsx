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
import { Lock, User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  const setAuth = useAuthStore((state) => state.setAuth);

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
      router.push("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  async function onSubmit(request: LoginSchema) {
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
                      <User className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
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
                      <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
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
              disabled={loginMutation.isPending}
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
