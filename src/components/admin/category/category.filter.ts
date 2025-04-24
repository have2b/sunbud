import { FilterField } from "@/components/common/FilterDialog";

export const categoryFilterFields: FilterField[] = [
  {
    key: "name",
    label: "Tên",
    type: "string",
  },
  {
    key: "isPublish",
    label: "Hiển thị",
    type: "boolean",
  },
  {
    key: "description",
    label: "Mô tả",
    type: "string",
  },
];
