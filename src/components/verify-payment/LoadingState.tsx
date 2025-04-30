import React from "react";

interface LoadingStateProps {
  isProcessing: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;
  
  return (
    <div className="my-8">
      <p className="mb-4 text-gray-700">
        Đang xử lý đơn hàng của bạn...
      </p>
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"></div>
    </div>
  );
};

export default LoadingState;
