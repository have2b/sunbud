import { FilterField } from "@/components/common/FilterDialog";

export const shipperOrderFilterFields: FilterField[] = [
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
