// Define interfaces for order-related data
export interface OrderProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  description?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: OrderProduct;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: string;
  status?: string;
  address?: string;
  phone?: string;
  deliveryMethod?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
