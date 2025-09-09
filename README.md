# ⚽ FuTurn  
**Gestión de turnos, e-commerce y experiencia de usuario en tiempo real.**

---

## 🔹 Funcionalidades principales

### 👥 Gestión de usuarios
- Registro / login (con **roles: admin, cliente**).
- Perfil de usuario con historial de **reservas y compras**.

> [!TIP]  
> Los clientes verán únicamente su historial, mientras que los admins tendrán acceso a la gestión de usuarios.

---

### 🏟️ Gestión de turnos (reservas de cancha)
- Calendario con disponibilidad (ej: franjas de 1 hora).
- Reservar cancha en un horario específico.
- Bloqueo de turnos para evitar doble reserva.
- Cancelación / modificación de reservas.
- Notificaciones (ej: email o WhatsApp).

> [!IMPORTANT]  
> El bloqueo de turnos es **clave** para evitar reservas duplicadas y garantizar la disponibilidad en tiempo real.

---

### 🛒 Venta de productos extra
- Catálogo de productos (**cervezas, gaseosas, snacks**).
- Agregar productos al carrito junto con la reserva.
- Control de stock en tiempo real.

> [!NOTE]  
> El stock debe actualizarse tanto en compras directas como en reservas.

---

### 🛠️ Administración (panel para la cancha)
- **CRUD** de canchas y horarios disponibles.
- **CRUD** de productos.
- Gestión de usuarios.
- Dashboard con **reservas del día y ventas**.

> [!TIP]  
> El dashboard puede incluir métricas como ingresos por día, canchas más utilizadas y productos más vendidos.

---

## 🔹 Stack Tecnológico

### 🔧 Backend
- **NestJS + TypeORM + PostgreSQL/MySQL**

**Módulos:**
- `auth` → login, registro, JWT, roles.
- `users` → perfil de usuario.
- `fields` → canchas (datos, horarios disponibles).
- `reservations` → turnos.
- `products` → catálogo de productos.
- `orders` → compras (productos + reservas).

**Integraciones:**
- Pasarela de pagos: **MercadoPago / Stripe**.
- Notificaciones: **Twilio, Nodemailer (email)**.
- **Cloudinary** para imágenes de productos y canchas.

---

### 🎨 Frontend
- **NextJS + TailwindCSS**

**Páginas principales:**
- Landing → info de la cancha, fotos, precios.
- Reserva → selector de día y horario.
- Carrito → cancha reservada + productos.
- Checkout → pago online.
- Perfil → historial de reservas y compras.
- Admin → panel de gestión.

> [!IMPORTANT]  
> La experiencia del usuario debe ser fluida: reserva + productos + pago en menos de **3 clics**.

---

## 🔹 Flujo de reserva + compra

1. Usuario elige **día y horario disponible** en la cancha.  
2. Selecciona productos (opcional).  
3. Se crea una **orden de compra** con la estructura:

```json
{
  "userId": "uuid",
  "fieldId": "uuid",
  "reservationDate": "2025-08-26T21:00:00",
  "products": [
    { "id": "uuid-prod-1", "quantity": 2 },
    { "id": "uuid-prod-2", "quantity": 1 }
  ]
}
```

4. Pasa a **checkout → pago online**.  
5. El backend **confirma la reserva** y descuenta stock.  
6. El usuario recibe confirmación por **email/WhatsApp**.  

> [!TIP]  
> Se recomienda implementar **pagos sandbox** para pruebas antes de la integración oficial con MercadoPago/Stripe.

---

## 🔹 Extras (futuro)

- ⏱️ Tiempo real con **WebSockets** (reservas confirmadas al instante).  
- 📅 **API pública** para integración con Google Calendar u otros servicios.  
- 🎁 Sistema de **puntos / fidelización**.  
- ⚽ Distintos tipos de canchas (**5, 7, 11 jugadores**).  

> [!NOTE]  
> Estas mejoras pueden planificarse como **MVP 2.0** para escalar el producto.  
