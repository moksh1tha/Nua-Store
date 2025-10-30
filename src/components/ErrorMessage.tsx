import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-[#E75650] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#E75650] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#d14842] transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
