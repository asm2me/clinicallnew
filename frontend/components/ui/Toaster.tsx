'use client';

import { useToastStore } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export function Toaster() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center justify-between px-4 py-3 rounded-lg border shadow-lg animate-slide-down',
            variantStyles[toast.variant]
          )}
        >
          <span className="text-sm font-medium">{toast.title}</span>
          <button onClick={() => remove(toast.id)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
