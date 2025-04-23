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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  insertCategorySchema,
  InsertCategorySchema,
} from "@/validations/category.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type InsertCategoryFormProps = { onSuccess?: () => void };

const InsertCategoryForm = ({ onSuccess }: InsertCategoryFormProps) => {
  const form = useForm<InsertCategorySchema>({
    resolver: valibotResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isPublish: false,
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategorySchema) => {
      const response = await axios.post("/api/admin/category", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Danh mục đã được tạo thành công");
      form.reset();
      onSuccess?.();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  async function onSubmit(data: InsertCategorySchema) {
    await createCategoryMutation.mutateAsync(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="isPublish"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Công khai</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={createCategoryMutation.isPending}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={createCategoryMutation.isPending}>
            {createCategoryMutation.isPending ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InsertCategoryForm;
