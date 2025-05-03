import { SidebarMenuItem } from "@/types/common";
import {
  BlocksIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PackageIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";

export const passwordRequirements = [
  { label: "Tối thiểu 8 ký tự", isValid: (pw: string) => pw.length >= 8 },
  {
    label: "Tối thiểu một ký tự đặc biệt",
    isValid: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
  {
    label: "Tối thiểu một chữ hoa",
    isValid: (pw: string) => /[A-Z]/.test(pw),
  },
  { label: "Tối thiểu một số", isValid: (pw: string) => /[0-9]/.test(pw) },
];

export const phoneRequirements = [
  { label: "Bắt đầu bằng 0", isValid: (ph: string) => ph.startsWith("0") },
  {
    label: "Ký tự thứ 2 là 9,8,3,5",
    isValid: (ph: string) => /^0[9835]/.test(ph),
  },
  { label: "Chỉ số", isValid: (ph: string) => /^\d+$/.test(ph) },
  { label: "10 ký tự", isValid: (ph: string) => ph.length === 10 },
];

export const avatarDropdownItems = [
  { label: "Thông tin cá nhân", href: "/account", icon: <UserIcon /> },
  { label: "Đơn hàng", href: "/orders", icon: <ShoppingCartIcon /> },
  {
    label: "Đăng xuất",
    href: "/logout",
    icon: <LogOutIcon className="text-red-500" />,
  },
] as const;

export const sidebarDropdownItems = [
  { label: "Thông tin cá nhân", href: "/account", icon: <UserIcon /> },
];

export const mainNavItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/shop" },
];

export const adminSidebarItems: SidebarMenuItem[] = [
  {
    title: "Bảng điều khiển",
    url: "/admin/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Tài khoản",
    url: "/admin/user",
    icon: <UserIcon />,
  },
  {
    title: "Danh mục",
    url: "/admin/category",
    icon: <BlocksIcon />,
  },
  {
    title: "Sản phẩm",
    url: "/admin/product",
    icon: <PackageIcon />,
  },
  {
    title: "Đơn hàng",
    url: "/admin/order",
    icon: <ShoppingCartIcon />,
  },
];

export const shipperSidebarItems: SidebarMenuItem[] = [
  {
    title: "Đơn hàng",
    url: "/shipper/order",
    icon: <ShoppingCartIcon />,
  },
  {
    title: "Lịch sử giao hàng",
    url: "/shipper/history",
    icon: <ShoppingCartIcon />,
  },
];
