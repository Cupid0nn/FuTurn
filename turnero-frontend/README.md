# FuTurn Frontend - Next.js 14 + TypeScript + TailwindCSS

Aplicación web moderna y minimalista estilo Apple para reservar canchas de fútbol. Diseño limpio, rápido y totalmente responsive.

## 🎨 Características

- ✅ **Diseño Apple-style**: Minimalista, limpio y moderno
- ✅ **Next.js 14**: React framework de última generación con App Router
- ✅ **TypeScript**: Type-safety en todo el proyecto
- ✅ **TailwindCSS**: Estilos modernos y responsive
- ✅ **Shadcn/ui**: Componentes reutilizables
- ✅ **Zustand**: State management simple y eficiente
- ✅ **Axios**: HTTP client con interceptores
- ✅ **JWT Authentication**: Autenticación segura
- ✅ **Responsive Design**: Mobile-first, funciona en todos los dispositivos

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear o editar `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas de Next.js (App Router)
│   ├── (auth)/            # Rutas públicas
│   │   ├── login/
│   │   └── register/
│   ├── (app)/             # Rutas protegidas
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Dashboard
│   │   ├── reservas/      # Mis reservas
│   │   ├── productos/     # Catálogo de productos
│   │   └── carrito/       # Carrito de compras
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Redirect
├── components/            # Componentes React
├── services/              # Cliente HTTP
├── store/                 # State management (Zustand)
├── types/                 # Tipos TypeScript
└── lib/                   # Utilidades
```

## 📋 Páginas Principales

- **`/`** - Página de inicio (redirige automáticamente)
- **`/login`** - Iniciar sesión
- **`/register`** - Crear cuenta
- **`/(app)`** - Dashboard con canchas disponibles
- **`/reservas`** - Mis reservas
- **`/productos`** - Catálogo de productos
- **`/carrito`** - Carrito de compras

## 🔐 Autenticación

- Login con correo + contraseña
- Registro de nuevos usuarios
- Token JWT guardado en localStorage
- Token añadido automáticamente a requests
- Logout limpia sesión y redirige a login

## 🛠 Scripts

```bash
npm run dev           # Iniciar servidor desarrollo
npm run build         # Compilar para producción
npm run start         # Iniciar servidor producción
npm run lint          # Ejecutar ESLint
```

## 📦 Tecnologías

- Next.js 14
- React 19
- TypeScript
- TailwindCSS
- Zustand
- Axios
- Lucide Icons

## 🔄 State Management

Dos stores principales con Zustand:

1. **authStore** - Autenticación y usuario
2. **carritoStore** - Carrito de compras

## 🎨 Diseño

Diseño tipo Apple:
- Minimalista y limpio
- Colores neutrales (blanco/gris/negro)
- Tipografía Inter
- Componentes suaves con hover effects
- Totalmente responsive

## ⚠️ Requisitos

- Backend corriendo en `http://localhost:3000`
- Node.js 18+ y npm

## 📞 Soporte

Consulta el README del backend en `../turnero-futbol/` para más información.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
