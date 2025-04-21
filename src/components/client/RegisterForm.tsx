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
import { passwordRequirements, phoneRequirements } from "@/constants";
import { registerSchema, RegisterSchema } from "@/validations/auth.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Circle, Lock, Mail, Phone, User } from "lucide-react";
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
  const phoneValue = form.watch("phone");

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      const response = await axios.post("/api/register", data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      localStorage.setItem("userEmail", variables.email);
      toast.success(data.message);
      localStorage.setItem("otpExpiry", data.data.otpExpiry.toString());
      router.push("/otp");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  async function onSubmit(request: RegisterSchema) {
    await registerMutation.mutateAsync(request);
  }

  return (
    <Card className="w-full border-rose-100 p-4 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold text-rose-600">
          Tạo tài khoản mới
        </CardTitle>
        <CardDescription className="text-center">
          Điền thông tin của bạn để đăng ký tài khoản
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
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                      <Input
                        placeholder="Tên đăng nhập..."
                        {...field}
                        className="pl-10"
                      />
                    </div>
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
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                      <Input
                        placeholder="Email của bạn..."
                        {...field}
                        className="pl-10"
                      />
                    </div>
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
                    <div className="relative">
                      <Phone className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                      <Input
                        placeholder="Số điện thoại..."
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {phoneRequirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-2">
                        {req.isValid(phoneValue) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300" />
                        )}
                        <span className="text-xs">{req.label}</span>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Họ
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Họ của bạn..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Tên
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Tên của bạn..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                      <Input
                        placeholder="Mật khẩu..."
                        {...field}
                        type="password"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {passwordRequirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-2">
                        {req.isValid(passwordValue) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300" />
                        )}
                        <span className="text-xs">{req.label}</span>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </motion.form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span>{"Đã có tài khoản? "}</span>
          <Link
            href="/login"
            className="font-medium text-rose-600 hover:underline"
          >
            Đăng nhập
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

export default RegisterForm;
