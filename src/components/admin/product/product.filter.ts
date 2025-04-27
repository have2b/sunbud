import { FilterField } from "@/components/common/FilterDialog";
import { Category } from "@/db/schema";

// Create a function that returns the filter fields with dynamic category options
export const getProductFilterFields = (categories: Category[]): FilterField[] => [
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
    type: "select",
    selectOptions: {
      options: categories.map(category => ({
        label: category.name,
        value: category.id
      }))
    }
  },
  {
    key: "isPublish",
    label: "Hiển thị",
    type: "boolean",
  },
];

// Default version with empty categories for backwards compatibility
export const productFilterFields: FilterField[] = getProductFilterFields([]);
