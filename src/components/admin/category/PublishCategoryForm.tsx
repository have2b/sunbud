"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PublishCategoryFormProps {
  category: Category;
  onClose: () => void;
}

const PublishCategoryForm: React.FC<PublishCategoryFormProps> = ({
  category,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (category) {
      setOpen(true);
    }
  }, [category]);

  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put("/api/admin/publish/category", {
        id: category.id,
      });
      return response.data;
    },
    onSuccess: async () => {
      toast.success(
        `${!category.isPublish ? "Hiển thị" : "Ẩn"} danh mục thành công`,
      );
      setOpen(false);
      onClose();
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
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
            {!category.isPublish ? "Hiển thị danh mục" : "Ẩn danh mục"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {category.isPublish ? (
            <>
              <p className="text-red-600 font-medium mb-2">
                Danh mục sẽ không hiển thị trong cửa hàng trực tuyến nếu bạn chọn trạng thái này. Bạn có chắc chắn không?
              </p>
              <p>
                Nếu danh mục này có sản phẩm, sản phẩm của nó sẽ không thể
                hiển thị trong cửa hàng.
              </p>
            </>
          ) : (
            <p>
              Bạn có chắc chắn muốn hiển thị danh mục &ldquo;
              <strong>{category.name}</strong>&rdquo;?
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
            {category.isPublish ? "Không" : "Hủy"}
          </Button>
          <Button
            className={`text-white ${category.isPublish ? "bg-red-600" : "bg-green-600"} hover:${category.isPublish ? "bg-red-700" : "bg-green-700"}`}
            onClick={handlePublish}
            disabled={publishMutation.isPending}
          >
            {publishMutation.isPending
              ? "Đang xử lý..."
              : category.isPublish
                ? "Có"
                : "Hiển thị"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishCategoryForm;
