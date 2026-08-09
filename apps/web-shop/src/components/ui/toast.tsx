import * as React from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast-${++toastId}`;
    set((state) => ({ toasts: [...state.toasts.slice(-3), { ...toast, id }] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(title: string, variant: ToastVariant = 'success', description?: string) {
  useToastStore.getState().push({ title, description, variant });
}

toast.success = (title: string, description?: string) => toast(title, 'success', description);
toast.error = (title: string, description?: string) => toast(title, 'error', description);
toast.info = (title: string, description?: string) => toast(title, 'info', description);
toast.warning = (title: string, description?: string) => toast(title, 'warning', description);

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="size-5 text-success" />,
  error: <AlertCircle className="size-5 text-destructive" />,
  info: <Info className="size-5 text-info" />,
  warning: <AlertCircle className="size-5 text-warning" />,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg',
              t.variant === 'success' && 'border-success/30',
              t.variant === 'error' && 'border-destructive/30',
              t.variant === 'info' && 'border-info/30',
              t.variant === 'warning' && 'border-warning/30',
            )}
          >
            <span className="mt-0.5 shrink-0">{icons[t.variant]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
