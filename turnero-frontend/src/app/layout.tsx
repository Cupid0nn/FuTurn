import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthWrapper } from '@/components/AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FuTurn - Reserva de Canchas de Fútbol',
  description: 'Plataforma moderna para reservar canchas de fútbol',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50`}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
