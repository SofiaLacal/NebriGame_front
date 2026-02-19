import { create } from 'zustand';

const DEFAULT_DURATION = 3000;

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (type, message, duration = DEFAULT_DURATION) => {
    const id = crypto.randomUUID();

    set((state) => ({
      toasts: [...state.toasts, { id, type, message }]
    }));
    
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export const toast = {
  success: (message, duration) => useToastStore.getState().addToast('success', message, duration),
  error: (message, duration) => useToastStore.getState().addToast('error', message, duration)
};

export default useToastStore;
