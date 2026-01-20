'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { initializeApi } from '@/services/api';

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Inicializar la API
    initializeApi();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuth = isAuthenticated();

    // Si está en una ruta pública, no hacer nada
    if (isPublicRoute) {
      return;
    }

    // Si está en una ruta privada pero no autenticado, redirigir a login
    if (!isAuth) {
      router.replace('/login');
    }
  }, [mounted, pathname, isAuthenticated, router]);

  // Mientras se monta el componente, no renderizar nada
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
