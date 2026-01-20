'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { authService } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar contraseñas
    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(nombre, correo, contraseña);
      // Redirigir a login
      router.push('/login?registered=true');
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al registrarse';
      setError(typeof mensaje === 'string' ? mensaje : mensaje[0]);
    } finally {
      setIsLoading(false);
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
            Crea tu cuenta para comenzar
          </p>
        </div>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>
              Completa el formulario para registrarte
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

              {/* Nombre input */}
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-medium text-neutral-900 dark:text-white">
                  Nombre completo
                </label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

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

              {/* Confirm password input */}
              <div className="space-y-2">
                <label htmlFor="confirmarContraseña" className="text-sm font-medium text-neutral-900 dark:text-white">
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmarContraseña"
                  type="password"
                  placeholder="••••••••"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
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
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>

              {/* Login link */}
              <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="font-semibold text-neutral-900 dark:text-white hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
