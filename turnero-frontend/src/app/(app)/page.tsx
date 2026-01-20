'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { canchasService } from '@/services/api';
import { Cancha } from '@/types';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        setLoading(true);
        const data = await canchasService.getAll();
        setCanchas(Array.isArray(data) ? data : []);
      } catch (err: any) {
        const mensaje = err.response?.data?.message || 'Error al cargar las canchas';
        setError(typeof mensaje === 'string' ? mensaje : mensaje[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchCanchas();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-950 dark:to-neutral-900 rounded-xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenido a FuTurn</h1>
        <p className="text-lg text-neutral-200 mb-6 max-w-2xl">
          Reserva las mejores canchas de fútbol en tu área con solo unos clics. Rápido, fácil y seguro.
        </p>
        <Link href="/reservas">
          <Button size="lg" variant="secondary">
            Hacer una reserva <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Canchas Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Canchas disponibles</h2>
          <Link href="/reservas">
            <Button variant="outline">Ver todas</Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : canchas.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {canchas.slice(0, 6).map((cancha) => (
              <Card key={cancha.id} className="hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg" />
                <CardHeader>
                  <CardTitle className="text-lg">{cancha.nombre}</CardTitle>
                  <CardDescription>{cancha.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">${cancha.precioHora}</span>
                    </div>
                    <span className={`text-sm font-medium ${cancha.disponible ? 'text-green-600' : 'text-red-600'}`}>
                      {cancha.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                  <Link href={`/reservas?cancha=${cancha.id}`}>
                    <Button className="w-full">Reservar ahora</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-40 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">No hay canchas disponibles en este momento</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Features Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ubicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Encuentra canchas en tu zona con nuestra plataforma interactiva.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Reserva a través de nuestro calendario intuitivo y flexibilidad de horarios.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💳
              Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Realiza pagos seguros con Mercado Libre y otras opciones de pago.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
