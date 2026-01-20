# 🚀 GUÍA RÁPIDA DE INICIO - FUTURN FRONTEND

## Estado Actual

✅ **Compilación**: EXITOSA (0 errores)
✅ **TypeScript**: Validado correctamente
✅ **Dependencias**: Todas instaladas
✅ **Estructura**: Completa y lista

## 🎯 Paso 1: Iniciar el Backend

El backend debe estar corriendo en `http://localhost:3000` antes de iniciar el frontend.

```bash
cd C:\Users\User\Desktop\FuTurn\turnero-futbol
npm run start:dev
```

Verifica que el backend esté corriendo en:
- http://localhost:3000
- http://localhost:3000/api/docs (Swagger)

## 🎯 Paso 2: Iniciar el Frontend

En otra terminal:

```bash
cd C:\Users\User\Desktop\FuTurn\turnero-frontend
npm run dev
```

El frontend estará disponible en:
- http://localhost:3000 (en dev, automáticamente redirige a una terminal diferente)

**Nota**: Next.js en dev usa un puerto diferente automáticamente si 3000 está ocupado.

## 📋 Páginas Disponibles

Una vez iniciado, accede a:

1. **http://localhost:3000** → Dashboard principal
2. **http://localhost:3000/login** → Iniciar sesión
3. **http://localhost:3000/register** → Crear cuenta
4. **http://localhost:3000/reservas** → Mis reservas
5. **http://localhost:3000/productos** → Catálogo de productos
6. **http://localhost:3000/carrito** → Carrito de compras

## 🧪 Credenciales de Prueba

Puedes registrar un nuevo usuario o usar credenciales creadas en el backend.

### Ejemplo: Registrarse

1. Ir a `/register`
2. Llenar formulario:
   - Nombre: Juan Pérez
   - Correo: juan@example.com
   - Contraseña: Password123!
3. Click en "Crear cuenta"
4. Se redirige a `/login`

### Ejemplo: Login

1. Ir a `/login`
2. Correo: juan@example.com
3. Contraseña: Password123!
4. Se redirige a dashboard

## 📁 Estructura de Archivos Clave

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx      ← Página de login
│   │   └── register/page.tsx   ← Página de registro
│   ├── (app)/
│   │   ├── page.tsx            ← Dashboard
│   │   ├── reservas/page.tsx   ← Mis reservas
│   │   ├── productos/page.tsx  ← Catálogo
│   │   └── carrito/page.tsx    ← Carrito
│   ├── layout.tsx              ← Layout raíz
│   └── page.tsx                ← Redirect
├── components/
│   ├── Navbar.tsx              ← Navegación
│   └── ui/                     ← Componentes shadcn
├── services/
│   └── api.ts                  ← Cliente HTTP
├── store/
│   ├── authStore.ts            ← State autenticación
│   └── carritoStore.ts         ← State carrito
└── types/
    └── index.ts                ← Tipos TypeScript
```

## 🔧 Editando el Proyecto

### Cambiar estilos

Los estilos usan **TailwindCSS**. Edita:

```typescript
// Ejemplo: cambiar color de botón
className="bg-neutral-900 text-white hover:bg-neutral-800"
```

### Agregar nuevas páginas

Crea archivo en `src/app/(app)/nueva-pagina/page.tsx`:

```typescript
'use client';

export default function NuevaPage() {
  return <div>Mi nueva página</div>;
}
```

### Editar componentes

Los componentes reutilizables están en `src/components/ui/`

## 🛠 Scripts Disponibles

```bash
npm run dev           # Iniciar desarrollo
npm run build         # Compilar producción
npm run start         # Iniciar servidor producción
npm run lint          # Ejecutar ESLint
```

## 🐛 Troubleshooting

### Error: "Cannot find module @/services/api"

**Solución**: Asegúrate de estar en `c:\Users\User\Desktop\FuTurn\turnero-frontend`

```bash
cd C:\Users\User\Desktop\FuTurn\turnero-frontend
npm run dev
```

### Error: "Connection refused" al hacer requests

**Solución**: El backend no está corriendo. Inicia primero:

```bash
cd C:\Users\User\Desktop\FuTurn\turnero-futbol
npm run start:dev
```

### Error: "Token is missing"

**Solución**: No estás autenticado. Ve a `/login` e inicia sesión.

### Error: "Port 3000 is already in use"

**Solución**: Otro proceso está usando el puerto. Next.js usará otro puerto automáticamente.

## 📚 Próximos Pasos

1. ✅ **Explorar el diseño** - Navega por las páginas para ver cómo se ve
2. ✅ **Probar autenticación** - Crea una cuenta y loguéate
3. ✅ **Probar reservas** - Haz una reserva desde el dashboard
4. ✅ **Agregar productos** - Agrega productos al carrito
5. ✅ **Integrar pagos** - Implementar flujo completo de pago

## 📞 Ayuda

- **Backend Docs**: `../turnero-futbol/docs/`
- **Frontend Docs**: Revisa `README.md` en esta carpeta
- **Swagger API**: http://localhost:3000/api/docs (cuando backend esté corriendo)

---

**¡Listo para empezar!** 🎉

Ejecuta los comandos de arriba y disfruta del desarrollo.
