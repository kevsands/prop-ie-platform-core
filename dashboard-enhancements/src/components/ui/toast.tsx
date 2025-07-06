'use client';

// src/components/ui/toast.tsx
import * as React from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion/dist/framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Toast variants using CVA
const toastVariants = cva(
  "flex w-full max-w-sm overflow-hidden rounded-lg shadow-lg border",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
        warning: "bg-yellow-50 border-yellow-200",
        info: "bg-blue-50 border-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Types
export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: React.ReactNode;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Create context
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Create a singleton pattern for the toast service
class ToastService {
  private static instance: ToastService;
  private subscribers: Set<(toast: Omit<Toast, 'id'>) => void> = new Set();

  private constructor() { }

  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  public subscribe(callback: (toast: Omit<Toast, 'id'>) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public showToast(toast: Omit<Toast, 'id'>): void {
    this.subscribers.forEach(callback => callback(toast));
  }
}

export const toastService = ToastService.getInstance();

// Toast provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 5000; // Default 5 seconds

    setToasts(prev => [...prev, { ...toast, id }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Subscribe to the toast service
  React.useEffect(() => {
    const unsubscribe = toastService.subscribe(addToast);
    return () => unsubscribe();
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast title component
export const ToastTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("text-sm font-medium text-gray-900", className)} {...props} />;
};

// Toast description
export const ToastDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("mt-1 text-sm text-gray-500", className)} {...props} />;
};

// Toast close button
export const ToastClose = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { removeToast } = useToast();
  const toast = React.useContext(ToastActionContext);

  if (!toast) {
    throw new Error('ToastClose must be used within a Toast');
  }

  return (
    <button
      className={cn(
        "ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none",
        className
      )}
      onClick={() => removeToast(toast.id)}
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  );
};

// Toast viewport
export const ToastViewport = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 flex flex-col items-end space-y-4 max-h-screen overflow-hidden">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastActionContext.Provider key={toast.id} value={toast}>
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={toastVariants({ variant: toast.variant })}
              style={{ maxWidth: '420px' }}
            >
              <div className="flex p-4 w-full">
                <div className="w-0 flex-1">
                  {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                  {toast.description && (
                    <ToastDescription>{toast.description}</ToastDescription>
                  )}
                  {toast.action && (
                    <div className="mt-2">{toast.action}</div>
                  )}
                </div>
                <ToastClose />
              </div>
            </motion.div>
          </ToastActionContext.Provider>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast action context to access toast data inside close button
const ToastActionContext = React.createContext<Toast | null>(null);

// Individual toast component
export const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants> & { toast?: Toast }
>(({ className, variant, toast, children, ...props }, ref) => {
  // Provide toast context for children
  if (toast) {
    return (
      <ToastActionContext.Provider value={toast}>
        <div
          ref={ref}
          className={cn(toastVariants({ variant }), className)}
          {...props}
        >
          {children}
        </div>
      </ToastActionContext.Provider>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

Toast.displayName = "Toast";

// Toast API for imperative usage
export const toast = {
  show: (props: Omit<Toast, 'id'>) => {
    toastService.showToast(props);
  },
  success: (props: Omit<Toast, 'id' | 'variant'>) => {
    toast.show({ ...props, variant: 'success' });
  },
  error: (props: Omit<Toast, 'id' | 'variant'>) => {
    toast.show({ ...props, variant: 'error' });
  },
  warning: (props: Omit<Toast, 'id' | 'variant'>) => {
    toast.show({ ...props, variant: 'warning' });
  },
  info: (props: Omit<Toast, 'id' | 'variant'>) => {
    toast.show({ ...props, variant: 'info' });
  },
};