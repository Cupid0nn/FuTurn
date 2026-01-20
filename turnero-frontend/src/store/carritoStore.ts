import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Producto } from '@/types';

export interface CarritoItem {
  productoId: string;
  producto: Producto;
  cantidad: number;
}

interface CarritoStore {
  items: CarritoItem[];
  total: number;

  addItem: (producto: Producto, cantidad: number) => void;
  removeItem: (productoId: string) => void;
  updateCantidad: (productoId: string, cantidad: number) => void;
  clear: () => void;
  calcularTotal: () => number;
}

export const useCarritoStore = create<CarritoStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (producto: Producto, cantidad: number) => {
        const state = get();
        const existente = state.items.find((item) => item.productoId === producto.id);

        if (existente) {
          set({
            items: state.items.map((item) =>
              item.productoId === producto.id
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...state.items,
              {
                productoId: producto.id,
                producto,
                cantidad,
              },
            ],
          });
        }

        // Recalcular total
        const newTotal = get().calcularTotal();
        set({ total: newTotal });
      },

      removeItem: (productoId: string) => {
        const state = get();
        set({
          items: state.items.filter((item) => item.productoId !== productoId),
        });

        const newTotal = get().calcularTotal();
        set({ total: newTotal });
      },

      updateCantidad: (productoId: string, cantidad: number) => {
        const state = get();
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }

        set({
          items: state.items.map((item) =>
            item.productoId === productoId ? { ...item, cantidad } : item
          ),
        });

        const newTotal = get().calcularTotal();
        set({ total: newTotal });
      },

      clear: () => {
        set({ items: [], total: 0 });
      },

      calcularTotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.producto.precio * item.cantidad,
          0
        );
      },
    }),
    {
      name: 'carrito-store',
    }
  )
);
