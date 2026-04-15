import { create } from 'zustand';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id:      string;
  title:   string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: Toast[];
  add:    (t: Omit<Toast, 'id'>) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add:    (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: Math.random().toString(36) }] })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(t: Omit<Toast, 'id'>): void {
  useToastStore.getState().add(t);
  setTimeout(() => {
    const { toasts, remove } = useToastStore.getState();
    const last = toasts[toasts.length - 1];
    if (last) remove(last.id);
  }, 4000);
}
