"use client";

/**
 * Custom hook for cart utility functions
 */
export const useCartUtils = () => {
  /**
   * Format price with Vietnamese currency
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return {
    formatPrice,
  };
};
