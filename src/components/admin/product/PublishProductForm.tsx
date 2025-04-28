"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PublishProductFormProps {
  product: Product;
  onClose: () => void;
}

const PublishProductForm: React.FC<PublishProductFormProps> = ({
  product,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (product) {
      setOpen(true);
    }
  }, [product]);

  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put("/api/admin/publish/product", {
        id: product.id,
      });
      return response.data;
    },
    onSuccess: async () => {
      toast.success(
        `${!product.isPublish ? "Hiển thị" : "Ẩn"} sản phẩm thành công`,
      );
      setOpen(false);
      onClose();
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: AxiosError) => {
      const msg =
        (error.response?.data as { message: string })?.message || error.message;
      toast.error(msg);
    },
  });

  const handlePublish = async () => {
    await publishMutation.mutateAsync();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {product.isPublish ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Bạn có chắc chắn muốn {product.isPublish ? "ẩn" : "hiển thị"} sản
            phẩm &ldquo;
            <strong>{product.name}</strong>&rdquo;?
          </p>
          {product.isPublish && (
            <p className="mt-2 text-red-600">
              Lưu ý: Sản phẩm sẽ không hiển thị trên trang chủ sau khi bị ẩn.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            disabled={publishMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className={`text-white ${!product.isPublish ? "bg-green-600" : "bg-red-600"} hover:${!product.isPublish ? "bg-green-700" : "bg-red-700"}`}
            onClick={handlePublish}
            disabled={publishMutation.isPending}
          >
            {publishMutation.isPending
              ? "Đang xử lý..."
              : product.isPublish
                ? "Ẩn sản phẩm"
                : "Hiển thị sản phẩm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishProductForm;
