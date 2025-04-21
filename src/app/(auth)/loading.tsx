export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
        <div className="absolute top-0 left-0 h-24 w-24 animate-spin rounded-full border-t-4 border-red-500"></div>
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Đang tải
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Vui lòng chờ trong khi chúng tôi chuẩn bị tài nguyên
        </p>
      </div>
    </div>
  );
}
