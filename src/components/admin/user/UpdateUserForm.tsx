"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import { User } from "@/db/schema";
import {
  updateUserSchema,
  UpdateUserSchema,
} from "@/validations/user.validation";

interface UpdateUserFormProps {
  user: User;
  onClose: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user, onClose }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserSchema>({
    resolver: valibotResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      });
      setOpen(true);
    }
  }, [user, form]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserSchema) => {
      const response = await axios.put("/api/admin/user", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Cập nhật người dùng thành công");
      setOpen(false);
      onClose();
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  async function onSubmit(data: UpdateUserSchema) {
    await updateUserMutation.mutateAsync(data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Chỉnh sửa người dùng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* hidden id field */}
            <input type="hidden" {...form.register("id")} />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tên người dùng</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên người dùng..."
                      {...field}
                      readOnly
                      disabled
                    />
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
                  <FormLabel>Tên</FormLabel>
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
                  <FormLabel>Họ</FormLabel>
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
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại..." {...field} />
                  </FormControl>
                  <FormMessage />
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
                  onClose();
                }}
                disabled={updateUserMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserForm;
