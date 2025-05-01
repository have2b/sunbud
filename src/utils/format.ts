/**
 * Format a number as currency with thousands separators
 * @param value - Number to format
 * @returns Formatted string with thousands separators
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

/**
 * Format a date to a readable string using Vietnamese locale
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
