# Integración Mercado Libre - FuTurn Turnero Futbol

## ✅ Implementado

### 1. **Módulo de Pagos (`src/pagos/`)**
   - **PagosService**: Servicio principal para interactuar con Mercado Libre
   - **PagosController**: Endpoints REST para gestión de pagos
   - **PagosModule**: Módulo inyectable en AppModule

### 2. **Endpoints de Pago**

#### Crear Preferencia de Pago
```http
POST /pagos/crear-preferencia
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "pedidoId": "550e8400-e29b-41d4-a716-446655440000",
  "emailComprador": "usuario@example.com",
  "nombreComprador": "Juan Pérez",
  "telefonoComprador": "+541234567890",
  "items": [
    {
      "descripcion": "Cancha 5 - Centro (2 horas)",
      "precio": 750,
      "cantidad": 2
    },
    {
      "descripcion": "Cerveza (6 unidades)",
      "precio": 150,
      "cantidad": 6
    },
    {
      "descripcion": "Árbitro para el partido",
      "precio": 500,
      "cantidad": 1
    }
  ]
}

Response:
{
  "preferenceId": "552711007-a288e0ba-5a28-4378-91c0-58364302ee34",
  "paymentUrl": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=552711007-a288e0ba-5a28-4378-91c0-58364302ee34"
}
```

#### Obtener Estado de Pago
```http
GET /pagos/obtener/:paymentId
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "id": "12345678",
  "status": "approved",
  "statusDetail": "accredited",
  "amount": 2900,
  "description": "Pedido FuTurn",
  "externalReference": "550e8400-e29b-41d4-a716-446655440000",
  "payerEmail": "usuario@example.com"
}
```

#### Confirmar Pago en Pedido
```http
POST /pedidos/:pedidoId/confirmar-pago
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "paymentId": "12345678"
}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "estado": "confirmado",
  "statusPago": "pagado",
  "total": 2900,
  "paymentId": "12345678",
  ...
}
```

### 3. **Webhooks de Mercado Libre**

```http
POST /pagos/webhook?topic=payment&id=12345678
```

Los webhooks reciben notificaciones en tiempo real cuando:
- Un pago es aprobado
- Un pago es rechazado
- Un pago está pendiente

### 4. **Estados de Pago en Entidad Pedido**

Nueva columna `statusPago` en tabla `pedidos`:
- `sin_pagar`: Pedido creado, sin intentar pago
- `pendiente`: Pago en proceso (esperando confirmación)
- `pagado`: Pago aprobado ✅
- `rechazado`: Pago rechazado ❌

### 5. **Flujo de Pago Completo**

```
1. Cliente crea pedido
   POST /pedidos
   ↓
2. Cliente solicita preferencia de pago
   POST /pagos/crear-preferencia
   ← Obtiene paymentUrl
   ↓
3. Cliente es redirigido a Mercado Libre
   Hace login en ML y confirma pago
   ↓
4. Mercado Libre notifica resultado
   POST /pagos/webhook
   ↓
5. Cliente es redirigido a app
   success/failure/pending
   ↓
6. Cliente confirma pago en sistema
   POST /pedidos/{pedidoId}/confirmar-pago
   ← Pedido pasa a estado "confirmado"
```

## 🔧 Configuración Requerida

### Crear Cuenta en Mercado Libre

1. Ir a https://www.mercadopago.com
2. Crear cuenta o usar existente
3. Ir a https://www.mercadopago.com/developers/panel
4. Generar **Access Token** en sección "Access Tokens"
5. Copiar el token

### Variables de Entorno (.env)

```bash
# Mercado Libre
MERCADO_LIBRE_ACCESS_TOKEN=APP_123456789_1234567890_abcdefg

# URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

### Configurar Webhooks (Producción)

En https://www.mercadopago.com/developers/panel:

1. Ir a "Webhooks"
2. Agregar URL: `https://tu-dominio.com/pagos/webhook`
3. Seleccionar evento: `payment`

## 💰 Precios Configurados

### Canchas
- Cancha 5 (Barrio): $500/hora
- Cancha 5 (Centro): $750/hora
- Cancha 7 (Barrio): $800/hora
- Cancha 7 (Centro): $1200/hora
- Cancha 11 (Premium): $2000/hora

### Productos
- Bebidas: $50-150 (Agua, gaseosas, cervezas)
- Snacks: $80-300 (Empanadas, sándwiches, milanesas)
- Equipo: $200-800 (Balones, redes, conos, pecheras)
- Servicios: $150-500 (Árbitro, estacionamiento, camerino)
- Merchandising: $180-450 (Botellas, toallas, camisetas)

## 📊 Ejemplo de Pedido Real

```json
{
  "emailComprador": "juan@example.com",
  "nombreComprador": "Juan Pérez",
  "telefonoComprador": "+541123456789",
  "pedidoId": "abc123-def456",
  "items": [
    {
      "descripcion": "Cancha 5 - Centro (2 horas)",
      "precio": 750,
      "cantidad": 2
    },
    {
      "descripcion": "Cerveza Quilmes (6 botellas)",
      "precio": 150,
      "cantidad": 6
    },
    {
      "descripcion": "Árbitro para el partido",
      "precio": 500,
      "cantidad": 1
    }
  ],
  "total": 2900
}
```

**Total a pagar**: $2900 ARS

## 🔄 Respuestas de Mercado Libre

### Pago Aprobado
```json
{
  "id": "12345678",
  "status": "approved",
  "statusDetail": "accredited",
  "amount": 2900,
  "description": "Pedido #abc123",
  "externalReference": "abc123-def456",
  "payerEmail": "juan@example.com"
}
```

### Pago Rechazado
```json
{
  "id": "12345678",
  "status": "rejected",
  "statusDetail": "cc_rejected_insufficient_amount",
  "amount": 2900,
  "externalReference": "abc123-def456",
  "payerEmail": "juan@example.com"
}
```

### Pago Pendiente (Transferencia Bancaria)
```json
{
  "id": "12345678",
  "status": "pending",
  "statusDetail": "pending_review_manual",
  "amount": 2900,
  "externalReference": "abc123-def456",
  "payerEmail": "juan@example.com"
}
```

## 🧪 Testing Local

### 1. Crear Pedido
```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"usuarioId": "...", "direccionEntrega": "Av. Corrientes 1234"}'
```

### 2. Agregar Productos al Pedido
```bash
curl -X POST http://localhost:3000/pedidos/{pedidoId}/productos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"productoId": "...", "cantidad": 2}'
```

### 3. Crear Preferencia de Pago
```bash
curl -X POST http://localhost:3000/pagos/crear-preferencia \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "pedidoId": "...",
    "emailComprador": "test@example.com",
    "nombreComprador": "Test User",
    "items": [
      {"descripcion": "Cancha", "precio": 750, "cantidad": 2}
    ]
  }'
```

### 4. Simular Pago (Sandbox Mercado Libre)
- Usar tarjeta de prueba: `4111111111111111`
- Mes: `12`
- Año: `2025`
- CVV: `123`

### 5. Confirmar Pago en Sistema
```bash
curl -X POST http://localhost:3000/pedidos/{pedidoId}/confirmar-pago \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"paymentId": "12345678"}'
```

## ✅ Checklist de Integración

- [x] Módulo PagosModule creado
- [x] Servicio PagosService con Mercado Libre SDK
- [x] Controlador con endpoints de pago
- [x] DTOs con validación (@ApiProperty)
- [x] Entidad Pedido con campos `statusPago`, `preferenceId`, `paymentId`
- [x] Integración con OrdersService (confirmarPago)
- [x] Manejo de webhooks
- [x] Redirecciones post-pago
- [x] Variables de entorno configuradas
- [x] Precios razonables en ARS
- [x] Compilación exitosa

## 📝 Próximos Pasos (Opcional)

- [ ] Testear con cuenta Mercado Libre real
- [ ] Implementar retries en pagos fallidos
- [ ] Agregar email de confirmación
- [ ] Dashboard de reportes de pagos
- [ ] Refunds automáticos para cancelaciones
- [ ] Rate limiting en endpoints de pago
- [ ] Logging detallado de transacciones

## 🚀 Deploy a Producción

1. Crear cuenta Business en Mercado Libre
2. Generar Access Token producción
3. Configurar variable `NODE_ENV=production`
4. Configurar dominio real en `APP_URL` y `FRONTEND_URL`
5. Registrar webhook en panel de Mercado Libre
6. Usar `CORS_ORIGIN` más restrictivo (dominio frontend)
7. Habilitar HTTPS obligatorio
8. Monitorear logs de transacciones

---

**Última actualización**: 2 de Diciembre, 2025
**Versión**: 1.0
**Status**: ✅ Listo para testing
