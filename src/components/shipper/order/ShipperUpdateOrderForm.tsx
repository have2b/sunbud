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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order, OrderStatus } from "@/generated/prisma";
import {
  updateShipperOrderSchema,
  UpdateShipperOrderSchema,
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

  const form = useForm<UpdateShipperOrderSchema>({
    resolver: valibotResolver(updateShipperOrderSchema),
    defaultValues: {
      id: order.id,
      status: order.status,
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        id: order.id,
        status: order.status,
      });
      setOpen(true);
    }
  }, [order, form]);

  const updateOrderMutation = useMutation({
    mutationFn: async (data: UpdateShipperOrderSchema) => {
      const response = await axios.put("/api/shipper/order", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Cập nhật đơn hàng thành công");
      setOpen(false);
      onClose();
      await queryClient.invalidateQueries({ queryKey: ["shipperOrders"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    },
  });

  async function onSubmit(data: UpdateShipperOrderSchema) {
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Trạng thái giao hàng</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={field.value !== OrderStatus.SHIPPING}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Trạng thái giao hàng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Only allow updating from SHIPPING to DELIVERED */}
                      {field.value === OrderStatus.SHIPPING ? (
                        <SelectItem value={OrderStatus.DELIVERED}>
                          {OrderStatus.DELIVERED}
                        </SelectItem>
                      ) : (
                        <SelectItem value={field.value}>
                          {field.value}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
              <Button 
                type="submit" 
                disabled={updateOrderMutation.isPending || order.status !== OrderStatus.SHIPPING}
              >
                {updateOrderMutation.isPending
                  ? "Đang cập nhật..."
                  : order.status !== OrderStatus.SHIPPING
                    ? "Không thể cập nhật"
                    : "Đánh dấu đã giao"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrderForm;
