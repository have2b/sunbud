"use client";

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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  updateProductSchema,
  UpdateProductSchema,
} from "@/validations/product.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdateProductFormProps {
  product: UpdateProductSchema;
  onClose: () => void;
}

const UpdateProductForm = ({ product, onClose }: UpdateProductFormProps) => {
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

      const { secure_url } = uploadResponse.data;
      form.setValue("imageUrl", secure_url);
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

  const form = useForm<UpdateProductSchema>({
    resolver: valibotResolver(updateProductSchema),
    defaultValues: {
      ...product,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
      setOpen(true);
    }
  }, [form, product]);

  const updateProductMutation = useMutation({
    mutationFn: async (data: UpdateProductSchema) => {
      const response = await axios.put("/api/admin/product", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Sản phẩm đã được cập nhật");
      setOpen(false);
      onClose();
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
          form.setError(field as keyof UpdateProductSchema, {
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

  async function onSubmit(values: UpdateProductSchema) {
    await updateProductMutation.mutateAsync(values);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Cập nhật sản phẩm</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map(
                        (category: { id: number; name: string }) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {updateProductMutation.isPending
                ? "Đang cập nhật..."
                : "Cập nhật sản phẩm"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductForm;
