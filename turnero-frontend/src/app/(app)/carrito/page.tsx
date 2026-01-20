'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCarritoStore } from '@/store/carritoStore';
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CarritoPage() {
  const { items, total, removeItem, updateCantidad, clear } = useCarritoStore();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Carrito de compras</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingCart className="w-12 h-12 text-neutral-400 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">Tu carrito está vacío</p>
            <Link href="/productos">
              <Button>Continuar comprando</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productoId}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {item.producto.nombre}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    ${item.producto.precio} c/u
                  </p>
                </div>

                <div className="flex items-center gap-4 mx-6">
                  <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateCantidad(item.productoId, item.cantidad - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-3 w-8 text-center text-sm font-medium">
                      {item.cantidad}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateCantidad(item.productoId, item.cantidad + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-right min-w-24">
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    ${(item.producto.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.productoId)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumen */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen de compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Envío</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full">Proceder al pago</Button>
                <Link href="/productos">
                  <Button variant="outline" className="w-full">Continuar comprando</Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => clear()}
              >
                Limpiar carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
