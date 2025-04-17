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
import { motion } from "framer-motion";
import { ArrowRightIcon, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const form = useForm<RegisterSchema>({
    resolver: valibotResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  async function onSubmit(request: RegisterSchema) {
    console.log(request);
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
                Create Account
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-center text-base font-medium"
            >
              Join our community today
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
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-600">
                      Username
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="Enter username..."
                          {...field}
                          className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
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
                          placeholder="Enter email..."
                          {...field}
                          className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                        />
                      </motion.div>
                    </FormControl>
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
                        First Name
                      </FormLabel>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <Input
                            placeholder="Enter first name..."
                            {...field}
                            className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
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
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <Input
                            placeholder="Enter last name..."
                            {...field}
                            className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
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
                      Password
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="Your password..."
                          {...field}
                          type="password"
                          className="rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
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
                  className="w-full gap-2 rounded-lg bg-gradient-to-r from-rose-400 to-purple-500 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-rose-200/40"
                >
                  Create Account
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
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-rose-400 transition-colors hover:text-rose-500"
                >
                  Sign in
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
