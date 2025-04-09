import { createFileRoute, Link } from "@tanstack/react-router";

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
import { RegisterSchema, registerSchema } from "@/schema/auth";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/_auth/register")({
  component: Register,
  head: () => ({
    meta: [{ title: "Sunbud - Register" }],
  }),
});

function Register() {
  // const navigate = useNavigate();

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
    // const response = await authService.login(request);
    // if (response.success) {
    //   navigate({ to: "/" });
    // }
    console.log(request);
  }
  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-12">
      <div className="flex-col items-center justify-center gap-8">
        <p className="text-center text-4xl font-black text-rose-200 uppercase">
          Welcome
        </p>
        <p className="text-muted-foreground text-center text-base font-medium">
          Please register to continue
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name..." {...field} />
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
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name..." {...field} />
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
            Register
          </Button>
          <div className="flex items-center justify-between">
            <Link to="/login">Already have an account?</Link>
          </div>
        </form>
      </Form>
    </section>
  );
}
