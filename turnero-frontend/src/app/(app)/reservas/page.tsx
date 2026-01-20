'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { reservasService } from '@/services/api';
import { Reserva } from '@/types';
import { CalendarIcon, MapPinIcon, Clock } from 'lucide-react';

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        const data = await reservasService.getAll();
        setReservas(Array.isArray(data) ? data : []);
      } catch (err: any) {
        const mensaje = err.response?.data?.message || 'Error al cargar las reservas';
        setError(typeof mensaje === 'string' ? mensaje : mensaje[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Mis Reservas</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">Gestiona tus reservas de canchas</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : reservas.length > 0 ? (
        <div className="grid gap-4">
          {reservas.map((reserva) => (
            <Card key={reserva.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div>
                  <CardTitle>{reserva.cancha?.nombre}</CardTitle>
                  <CardDescription className="mt-1">
                    {reserva.cancha?.descripcion}
                  </CardDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor(reserva.estado)}`}>
                  {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(reserva.fechaHora).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(reserva.fechaHora).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">${reserva.cancha?.precioHora}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-40 text-center">
            <div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                No tienes reservas aún
              </p>
              <Link href="/">
                <Button>Haz una reserva</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
