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
import { registerSchema, RegisterSchema } from "@/validations/auth.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRightIcon, Check, Circle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: valibotResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });
  const passwordValue = form.watch("password");
  const passwordRequirements = [
    { label: "Tối thiểu 8 ký tự", isValid: (pw: string) => pw.length >= 8 },
    {
      label: "Tối thiểu một ký tự đặc biệt",
      isValid: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
    {
      label: "Tối thiểu một chữ hoa",
      isValid: (pw: string) => /[A-Z]/.test(pw),
    },
    { label: "Tối thiểu một số", isValid: (pw: string) => /[0-9]/.test(pw) },
  ];

  const phoneValue = form.watch("phone");
  const phoneRequirements = [
    { label: "Bắt đầu bằng 0", isValid: (ph: string) => ph.startsWith("0") },
    {
      label: "Ký tự thứ 2 là 9,8,3,5",
      isValid: (ph: string) => /^0[9835]/.test(ph),
    },
    { label: "Chỉ số", isValid: (ph: string) => /^\d+$/.test(ph) },
    { label: "10 ký tự", isValid: (ph: string) => ph.length === 10 },
  ];

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      const response = await axios.post("/api/register", data);
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

  async function onSubmit(request: RegisterSchema) {
    registerMutation.mutate(request);
  }

  return (
    <section className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-md rounded-2xl px-4 shadow-2xl md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 p-8"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <LockKeyhole className="text-primary size-6 md:size-8" />
              <p className="bg-primary bg-clip-text text-2xl font-black text-transparent uppercase md:text-4xl">
                Đăng ký
              </p>
            </div>
          </div>

          {/* Form Section */}
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 rounded-2xl bg-white/80"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Tên đăng nhập
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="Tên đăng nhập..."
                          {...field}
                          className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Email
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="Email..."
                          {...field}
                          className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all"
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Điện thoại
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="Số điện thoại..."
                          {...field}
                          className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all"
                        />
                      </motion.div>
                    </FormControl>
                    <div className="mt-2">
                      <ul className="space-y-1">
                        {phoneRequirements.map((req) => (
                          <motion.li
                            key={req.label}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {req.isValid(phoneValue) ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="circle"
                                initial={{ scale: 1 }}
                                animate={{ scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Circle className="h-4 w-4 text-gray-300" />
                              </motion.div>
                            )}
                            <span
                              className={
                                req.isValid(phoneValue)
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }
                            >
                              {req.label}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Fields Container */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* First Name Field */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-600">
                        Họ
                      </FormLabel>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <Input
                            placeholder="Họ..."
                            {...field}
                            className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name Field */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-600">
                        Tên
                      </FormLabel>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <Input
                            placeholder="Tên..."
                            {...field}
                            className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

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
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="Mật khẩu..."
                          {...field}
                          type="password"
                          className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all"
                        />
                      </motion.div>
                    </FormControl>
                    <div className="mt-2">
                      <ul className="space-y-1">
                        {passwordRequirements.map((req) => (
                          <li
                            key={req.label}
                            className="flex items-center gap-2"
                          >
                            {req.isValid(passwordValue) ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-300" />
                            )}
                            <span
                              className={
                                req.isValid(passwordValue)
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }
                            >
                              {req.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
                  className="bg-primary hover:bg-primary/85 w-full gap-2 rounded-lg py-3 text-base font-semibold text-white shadow-lg transition-all hover:cursor-pointer"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </motion.div>

              {/* Login Link */}
              <motion.div
                className="pt-4 text-center text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-secondary font-semibold transition-colors"
                >
                  Đăng nhập
                </Link>
              </motion.div>
            </motion.form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterForm;
