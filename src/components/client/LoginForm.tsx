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
import { ArrowRightIcon, LockKeyhole } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Simulate client-side loading delay
  useEffect(() => {
    const timer = setTimeout(() => {}, 10000);
    return () => clearTimeout(timer);
  }, []);

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
      router.push("/protected");
      setAuth(data.data, data.data.expiresIn);
    },
  });

  async function onSubmit(request: LoginSchema) {
    await loginMutation.mutateAsync(request);
  }

  return (
    <section className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-md px-4 shadow-2xl md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-8 w-8 text-rose-300" />
              <p className="bg-rose-300 bg-clip-text text-4xl font-black text-transparent uppercase">
                Mừng bạn trở lại
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-center text-base font-medium"
            >
              Mời bạn đăng nhập
            </motion.p>
          </div>

          {/* Form Section */}
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 rounded-2xl bg-white/80 p-8 shadow-2xl shadow-rose-100/30 backdrop-blur-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Email/Username Field */}
              <FormField
                control={form.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Email hoặc tên đăng nhập
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Input
                          placeholder="Email hoặc tên đăng nhập của bạn..."
                          {...field}
                          className="rounded-lg border-2 border-slate-300 px-4 py-3 transition-all focus-visible:border-blue-300"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Input
                          placeholder="Mật khẩu của bạn..."
                          {...field}
                          type="password"
                          className="rounded-lg border-2 border-slate-300 px-4 py-3 transition-all focus-visible:border-blue-300"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  className="w-full gap-2 rounded-lg bg-rose-400 py-3 text-base font-semibold text-white shadow-lg transition-all hover:cursor-pointer hover:bg-rose-500 hover:shadow-rose-200/40"
                  disabled={loginMutation.isPending}
                >
                  Đăng nhập
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </motion.div>

              {/* Additional Links */}
              <motion.div
                className="pt-4 text-center text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {`Chưa có tài khoản?${" "}`}
                <Link
                  href="/register"
                  className="font-semibold text-rose-400 transition-colors hover:text-rose-500"
                >
                  Đăng ký
                </Link>
              </motion.div>
            </motion.form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginForm;
