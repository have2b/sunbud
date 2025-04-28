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
import { Progress } from "@/components/ui/progress";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  insertProductSchema,
  InsertProductSchema,
} from "@/validations/product.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Default values for product form
const defaultValues = {
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  imageUrl: "",
  categoryId: undefined,
  isPublish: false,
};

const InsertProductForm = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const signatureResponse = await axios.post("/api/admin/signature");
      const { timestamp, signature, apiKey, cloudName } =
        signatureResponse.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("cloud_name", cloudName);

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setUploadProgress(percent);
          },
        },
      );

      const { secure_url, public_id, width, height, bytes } =
        uploadResponse.data;
      form.setValue("imageUrl", secure_url);
      form.setValue("imagePublicId", public_id);
      form.setValue("imageWidth", width);
      form.setValue("imageHeight", height);
      form.setValue("imageSize", bytes);
      setUploadError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setUploadError(error.message || "Image upload failed. Please try again.");
    } finally {
      setUploadProgress(0);
    }
  };

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/admin/category", {
        params: {
          limit: 100,
          isPublish: true,
        },
      });
      return response.data.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData || [];

  const form = useForm<InsertProductSchema>({
    resolver: valibotResolver(insertProductSchema),
    defaultValues,
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProductSchema) => {
      const response = await axios.post("/api/admin/product", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Sản phẩm đã được tạo thành công");
      form.reset();
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // Handle unique constraint errors
      if (error.response?.status === 409 && error.response.data?.data?.errors) {
        const fieldErrors = error.response.data.data.errors as Record<
          string,
          string
        >;
        Object.entries(fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof InsertProductSchema, {
            type: "server",
            message,
          });
        });
      } else {
        const msg = error.response?.data?.message || error.message;
        toast.error(msg);
      }
    },
  });

  async function onSubmit(values: InsertProductSchema) {
    await createProductMutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 shadow-lg transition-all hover:shadow-md"
          size="lg"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Thêm sản phẩm</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel required>Ảnh</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                      {uploadProgress > 0 && (
                        <Progress value={uploadProgress} className="h-2" />
                      )}
                      {form.getValues("imageUrl") && (
                        <div className="relative size-16">
                          <Image
                            src={form.getValues("imageUrl") ?? ""}
                            alt="Preview"
                            fill
                            objectFit="contain"
                          />
                        </div>
                      )}
                      {uploadError && (
                        <p className="text-destructive text-sm font-medium">
                          {uploadError}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Danh mục</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={
                        categories?.map(
                          (category: { id: number; name: string }) => ({
                            label: category.name,
                            value: category.id.toString(),
                          }),
                        ) || []
                      }
                      value={field.value?.toString() || ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                      placeholder="Chọn danh mục"
                      searchPlaceholder="Tìm kiếm danh mục..."
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel required>Hiển thị</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                disabled={createProductMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createProductMutation.isPending}>
                {createProductMutation.isPending
                  ? "Đang tạo..."
                  : "Thêm sản phẩm"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InsertProductForm;
