import { FilterField } from "@/components/common/FilterDialog";

export const userFilterFields: FilterField[] = [
  {
    key: "username",
    label: "Tên người dùng",
    type: "string",
  },
  {
    key: "email",
    label: "Email",
    type: "string",
  },
  {
    key: "firstName",
    label: "Tên",
    type: "string",
  },
  {
    key: "lastName",
    label: "Họ",
    type: "string",
  },
  {
    key: "phone",
    label: "Số điện thoại",
    type: "string",
  },
  {
    key: "role",
    label: "Vai trò",
    type: "string",
  },
  {
    key: "isVerified",
    label: "Trạng thái",
    type: "boolean",
  },
];
