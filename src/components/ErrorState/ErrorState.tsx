import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: Props) => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center gap-4">
      <AlertTriangle size={40} className="text-red-400" />
      <p className="text-gray-300 text-sm text-center max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-sm text-white font-semibold
            bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-2 rounded-xl"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
