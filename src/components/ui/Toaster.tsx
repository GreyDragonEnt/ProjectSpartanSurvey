import React, { useEffect } from 'react';
import useToast from '../../hooks/useToast';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const Toast: React.FC<{
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: (id: string) => void;
}> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md border ${getBackgroundColor()} flex items-center transform transition-all duration-500 ease-in-out animate-slide-in`}>
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="flex-grow">{message}</div>
      <button
        onClick={() => onDismiss(id)}
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-6 space-y-4 z-50 pointer-events-none">
      <div className="space-y-4 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </div>
  );
};

export default Toaster;