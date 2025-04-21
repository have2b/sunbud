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
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/validations/auth.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordSchema>({
    resolver: valibotResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ForgotPasswordSchema) => {
      const response = await axios.post("/api/reset-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/login");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  async function onSubmit(values: { email: string }) {
    await resetMutation.mutateAsync(values);
  }

  return (
    <Card className="w-full border-rose-100 p-4 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold text-rose-600">
          Đặt lại mật khẩu
        </CardTitle>
        <CardDescription className="text-center">
          Nhập địa chỉ email của bạn để nhận mật khẩu mới
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-600">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                      <Input
                        placeholder="Nhập địa chỉ email của bạn..."
                        className="pl-10"
                        {...field}
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
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? "Đang gửi..." : "Gửi mật khẩu mới"}
            </Button>
          </motion.form>
        </Form>
      </CardContent>
      <CardContent className="flex flex-col space-y-4">
        <div className="text-muted-foreground text-center text-sm">
          <Link href="/login" className="text-rose-600 hover:underline">
            <span>Quay lại đăng nhập</span>
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
      </CardContent>
    </Card>
  );
}
