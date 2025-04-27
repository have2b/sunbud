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
  },
  {
    key: "quantity",
    label: "Số lượng",
    type: "number",
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
