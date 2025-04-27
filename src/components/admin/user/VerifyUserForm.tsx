"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VerifyUserFormProps {
  user: User;
  onClose: () => void;
}

const VerifyUserForm: React.FC<VerifyUserFormProps> = ({ user, onClose }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setOpen(true);
    }
  }, [user]);

  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put("/api/admin/publish/user", {
        id: user.id,
      });
      return response.data;
    },
    onSuccess: async () => {
      toast.success(
        `${!user.isVerified ? "Kích hoạt" : "Vô hiệu hóa"} người dùng thành công`,
      );
      setOpen(false);
      onClose();
      await queryClient.invalidateQueries({ queryKey: ["users"] });
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
            {!user.isVerified
              ? "Kích hoạt người dùng"
              : "Vô hiệu hóa người dùng"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Bạn có chắc chắn muốn{" "}
            {!user.isVerified ? "kích hoạt" : "vô hiệu hóa"} người dùng &ldquo;
            <strong>{user.username}</strong>&rdquo;?
          </p>
          {user.isVerified && (
            <p className="mt-2 text-red-600">
              Lưu ý: Người dùng sẽ không thể đăng nhập sau khi bị vô hiệu hóa.
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
            className={`text-white ${!user.isVerified ? "bg-green-600" : "bg-red-600"} hover:${!user.isVerified ? "bg-green-700" : "bg-red-700"}`}
            onClick={handlePublish}
            disabled={publishMutation.isPending}
          >
            {publishMutation.isPending
              ? "Đang xử lý..."
              : !user.isVerified
                ? "Kích hoạt"
                : "Vô hiệu hóa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyUserForm;
