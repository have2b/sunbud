import { FilterField } from "@/components/common/FilterDialog";

export const orderFilterFields: FilterField[] = [
  {
    key: "user",
    label: "Khách hàng",
    type: "string",
  },
  {
    key: "status",
    label: "Trạng thái",
    type: "string",
  },
  {
    key: "paymentStatus",
    label: "Trạng thái thanh toán",
    type: "string",
  },
  {
    key: "paymentMethod",
    label: "Phương thức thanh toán",
    type: "string",
  },
  {
    key: "deliveryMethod",
    label: "Phương thức giao hàng",
    type: "string",
  },
  {
    key: "totalAmount",
    label: "Giá",
    type: "number",
    numberOptions: {
      minLabel: "Giá từ",
      maxLabel: "Giá đến",
      step: 1000,
      unit: "₫",
    },
  },
];
