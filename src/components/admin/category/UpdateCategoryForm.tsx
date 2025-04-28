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
import { Textarea } from "@/components/ui/textarea";

import { Category } from "@/generated/prisma";
import {
  updateCategorySchema,
  UpdateCategorySchema,
} from "@/validations/category.validation";

interface UpdateCategoryFormProps {
  category: Category;
  onClose: () => void;
}

const UpdateCategoryForm: React.FC<UpdateCategoryFormProps> = ({
  category,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateCategorySchema>({
    resolver: valibotResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description ?? "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        name: category.name,
        description: category.description ?? "",
      });
      setOpen(true);
    }
  }, [category, form]);

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: UpdateCategorySchema) => {
      const response = await axios.put("/api/admin/category", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Cập nhật danh mục thành công");
      setOpen(false);
      onClose();
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  async function onSubmit(data: UpdateCategorySchema) {
    await updateCategoryMutation.mutateAsync(data);
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
            Chỉnh sửa danh mục
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* hidden id field */}
            <input type="hidden" {...form.register("id")} />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả (không bắt buộc)..."
                      {...field}
                      value={field.value ?? ""}
                    />
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
                disabled={updateCategoryMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateCategoryMutation.isPending}>
                {updateCategoryMutation.isPending
                  ? "Đang cập nhật..."
                  : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryForm;
