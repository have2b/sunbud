import { createFileRoute, useNavigate } from "@tanstack/react-router";

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
import { LoginSchema, loginSchema } from "@/schema/auth";
import { authService } from "@/services/auth";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/_auth/login")({
  component: Login,
  head: () => ({
    meta: [{ title: "Sunbud - Login" }],
  }),
});

function Login() {
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: valibotResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  async function onSubmit(request: LoginSchema) {
    const response = await authService.login(request);
    if (response.success) {
      navigate({ to: "/" });
    }
  }
  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-12">
      <div className="flex-col items-center justify-center gap-8">
        <p className="text-center text-4xl font-black text-rose-200 uppercase">
          Welcome back
        </p>
        <p className="text-muted-foreground text-center text-base font-medium">
          Please sign in to continue
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-8"
        >
          <FormField
            control={form.control}
            name="emailOrUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your email or username..." {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your password..."
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </section>
  );
}
