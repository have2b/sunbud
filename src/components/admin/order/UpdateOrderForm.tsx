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

import { Order } from "@/generated/prisma";
import {
  updateOrderSchema,
  UpdateOrderSchema,
} from "@/validations/order.validation";

interface UpdateOrderFormProps {
  order: Order;
  onClose: () => void;
}

const UpdateOrderForm: React.FC<UpdateOrderFormProps> = ({
  order,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateOrderSchema>({
    resolver: valibotResolver(updateOrderSchema),
    defaultValues: {
      id: order.id,
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryMethod: order.deliveryMethod,
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        id: order.id,
        totalAmount: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        deliveryMethod: order.deliveryMethod,
      });
      setOpen(true);
    }
  }, [order, form]);

  const updateOrderMutation = useMutation({
    mutationFn: async (data: UpdateOrderSchema) => {
      const response = await axios.put("/api/admin/order", data);
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

  async function onSubmit(data: UpdateOrderSchema) {
    await updateOrderMutation.mutateAsync(data);
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
            Chỉnh sửa đơn hàng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* hidden id field */}
            <input type="hidden" {...form.register("id")} />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tổng tiền</FormLabel>
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

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                  onClose();
                }}
                disabled={updateOrderMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateOrderMutation.isPending}>
                {updateOrderMutation.isPending
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

export default UpdateOrderForm;
