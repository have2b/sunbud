import { FilterField } from "@/components/common/FilterDialog";

export const productFilterFields: FilterField[] = [
  {
    key: "name",
    label: "Tên sản phẩm",
    type: "string",
  },
  {
    key: "description",
    label: "Mô tả",
    type: "string",
  },
  {
    key: "price",
    label: "Giá",
    type: "number",
    numberOptions: {
      minLabel: "Giá từ",
      maxLabel: "Giá đến",
      step: 1000,
      unit: "₫"
    }
  },
  {
    key: "quantity",
    label: "Số lượng",
    type: "number",
    numberOptions: {
      minLabel: "Từ",
      maxLabel: "Đến",
      step: 1
    }
  },
  {
    key: "categoryId",
    label: "Danh mục",
    type: "number",
  },
  {
    key: "isPublish",
    label: "Hiển thị",
    type: "boolean",
  },
];
