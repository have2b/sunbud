export interface BaseResponse {
  status: number;
  success: boolean;
  message: string;
  data: object;
}

export interface SidebarMenuItem {
  title: string;
  url: string;
  icon: React.ReactNode;
}
