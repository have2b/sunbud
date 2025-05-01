"use client";

import OrderHistoryList from "@/components/orders/OrderHistoryList";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Check if the store has been hydrated
  useEffect(() => {
    const unsubHydrate = useAuthStore.persist.onHydrate(() => {
      setIsHydrated(false); // Reset on hydration start
    });

    const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // Handle case where store is already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubHydrate();
      unsubFinish();
    };
  }, []);

  useEffect(() => {
    // Only check authentication after hydration is complete
    if (!isHydrated) return;

    // Redirect to login if not authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch order history
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/user/order/history");
        const result = await response.json();

        if (result.status !== 200) {
          throw new Error(result.message || "Failed to fetch order history");
        }

        setOrders(result.data);
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load order history",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, router, isHydrated]);

  // Show loading state if not hydrated yet
  if (!isHydrated) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-8">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2"></div>
      </div>
    );
  }

  if (isHydrated && !user) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Lịch sử đơn hàng</h1>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2"></div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <OrderHistoryList orders={orders} />
      )}
    </div>
  );
}
