'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { productosService } from '@/services/api';
import { useCarritoStore } from '@/store/carritoStore';
import { Producto } from '@/types';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCarritoStore();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await productosService.getAll();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err: any) {
        const mensaje = err.response?.data?.message || 'Error al cargar los productos';
        setError(typeof mensaje === 'string' ? mensaje : mensaje[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleAddToCart = (producto: Producto) => {
    const cantidad = cantidades[producto.id] || 1;
    if (cantidad > 0) {
      addItem(producto, cantidad);
      setCantidades({ ...cantidades, [producto.id]: 0 });
      // Mostrar notificación (opcional)
      alert(`${producto.nombre} agregado al carrito`);
    }
  };

  const updateCantidad = (productoId: string, delta: number) => {
    const current = cantidades[productoId] || 0;
    const newValue = Math.max(0, current + delta);
    setCantidades({ ...cantidades, [productoId]: newValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Productos</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Agrega productos a tu pedido
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : productos.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <Card key={producto.id} className="flex flex-col">
              <div className="h-40 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-lg" />
              <CardHeader>
                <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                <CardDescription>{producto.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    ${producto.precio}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Stock: {producto.stock}
                  </div>
                </div>

                {producto.disponible ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateCantidad(producto.id, -1)}
                        disabled={!cantidades[producto.id] || cantidades[producto.id] === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        max={producto.stock}
                        value={cantidades[producto.id] || 0}
                        onChange={(e) =>
                          setCantidades({
                            ...cantidades,
                            [producto.id]: Math.min(parseInt(e.target.value) || 0, producto.stock),
                          })
                        }
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateCantidad(producto.id, 1)}
                        disabled={(cantidades[producto.id] || 0) >= producto.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={() => handleAddToCart(producto)}
                      disabled={!cantidades[producto.id] || cantidades[producto.id] === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar
                    </Button>
                  </div>
                ) : (
                  <Button disabled className="w-full">
                    No disponible
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-40 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              No hay productos disponibles en este momento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
