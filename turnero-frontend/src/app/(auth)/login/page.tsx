'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/api';
import { mockUsuarios } from '@/services/mockData';

export default function LoginPage() {
  const router = useRouter();
  const { login, setError, setLoading } = useAuthStore();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setErrorLocal] = useState('');
  const [isLoading, setIsLoadingLocal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    setIsLoadingLocal(true);
    setLoading(true);

    try {
      const response = await authService.login(correo, contraseña);
      
      // El backend retorna { token_acceso: "..." }
      if (response.token_acceso) {
        // Obtener datos del usuario desde mockData
        const usuarioData = mockUsuarios.find(u => u.correo === correo);
        
        // Crear el objeto usuario con el token
        const usuarioConToken = {
          token: response.token_acceso,
          id: usuarioData?.id || '',
          nombre: usuarioData?.nombre || '',
          correo: correo,
          rol: usuarioData?.rol || 'cliente' as const,
          createdAt: usuarioData?.createdAt || new Date().toISOString(),
        };

        login(usuarioConToken);
        router.push('/');
      }
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al iniciar sesión';
      setErrorLocal(typeof mensaje === 'string' ? mensaje : mensaje[0]);
      setError(typeof mensaje === 'string' ? mensaje : mensaje[0]);
    } finally {
      setIsLoadingLocal(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            FuTurn
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Reserva tu cancha de fútbol favorita
          </p>
        </div>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tu correo y contraseña para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Email input */}
              <div className="space-y-2">
                <label htmlFor="correo" className="text-sm font-medium text-neutral-900 dark:text-white">
                  Correo electrónico
                </label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label htmlFor="contraseña" className="text-sm font-medium text-neutral-900 dark:text-white">
                  Contraseña
                </label>
                <Input
                  id="contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>

              {/* Register link */}
              <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="font-semibold text-neutral-900 dark:text-white hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
