import { create } from 'zustand';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const state = get();
    const existingItem = state.items.find((i) => i.id === item.id);
    
    if (existingItem) {
      set({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...state.items, { ...item, quantity: 1 }] });
    }
  },
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
    ),
  })),
  clearCart: () => set({ items: [] }),
  total: () => {
    return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },
}));
