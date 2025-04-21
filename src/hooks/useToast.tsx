import { useState, useCallback, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const newToast: Toast = {
      id: uuidv4(),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  // Check if we're inside a ToastProvider
  const context = useContext(ToastContext);
  
  // If not inside a provider, create a local toast state
  if (context === undefined) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
      const newToast: Toast = {
        id: uuidv4(),
        message,
        type,
      };
      setToasts((prev) => [...prev, newToast]);
    }, []);

    const dismissToast = useCallback((id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return { toasts, showToast, dismissToast };
  }
  
  return context;
};

export default useToast;