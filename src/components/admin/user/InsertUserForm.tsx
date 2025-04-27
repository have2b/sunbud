"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  InsertUserSchema,
  insertUserSchema,
} from "@/validations/user.validation";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const InsertUserForm = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<InsertUserSchema>({
    resolver: valibotResolver(insertUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: InsertUserSchema) => {
      const response = await axios.post("/api/admin/user", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Người dùng đã được tạo thành công");
      form.reset();
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // Handle unique constraint errors
      if (error.response?.status === 409 && error.response.data?.data?.errors) {
        const fieldErrors = error.response.data.data.errors as Record<string, string>;
        Object.entries(fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof InsertUserSchema, { type: 'server', message });
        });
      } else {
        const msg = error.response?.data?.message || error.message;
        toast.error(msg);
      }
    },
  });

  async function onSubmit(data: InsertUserSchema) {
    await createUserMutation.mutateAsync(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 shadow-lg transition-all hover:shadow-md"
          size="lg"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Thêm người dùng</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Thêm người dùng mới
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tên người dùng</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên người dùng..." {...field} />
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
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email..." {...field} />
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
                  <FormLabel required>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên..." {...field} />
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
                  <FormLabel required>Họ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại..." {...field} />
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
                  <FormLabel required>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
                disabled={createUserMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Đang tạo..." : "Tạo mới"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InsertUserForm;
