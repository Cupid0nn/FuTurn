# Tests - FuTurn Backend

## ✅ Estado de los Tests

**Total Tests**: 33 PASSING ✅  
**Test Suites**: 4 completos  
**Coverage**: Servicios y lógica principal

### Test Coverage por Módulo

#### 1. **AuthService** (11 tests)
- ✅ `register()` - Registro de usuarios con bcrypt
- ✅ Manejo de conflicto de correo duplicado
- ✅ `login()` - Generación de JWT token
- ✅ Login con credenciales inválidas
- ✅ `validateUser()` - Validación de contraseña
- ✅ Retorno null en usuario no encontrado
- ✅ Retorno null en contraseña incorrecta
- ✅ Sin devolución de contraseña en respuestas

**Tests File**: `src/auth/auth.service.spec.ts`

#### 2. **OrdersService** (9 tests)
- ✅ `crear()` - Creación de pedidos
- ✅ NotFoundException en usuario inexistente
- ✅ `obtenerTodos()` - Listado de pedidos
- ✅ `obtenerPorId()` - Obtención por ID
- ✅ `obtenerPorUsuario()` - Filtro por usuario
- ✅ `agregarProducto()` - Agregar items a pedido
- ✅ BadRequestException en stock insuficiente
- ✅ `confirmarPago()` - Confirmación de pago con estado
- ✅ BadRequestException en montos no coincidentes

**Tests File**: `src/pedidos/orders.service.spec.ts`

#### 3. **PagosService** (9 tests)
- ✅ `crearPreferencia()` - Creación de preferencia ML
- ✅ BadRequestException sin access token
- ✅ Manejo de errores de API ML
- ✅ `obtenerPago()` - Obtención de información de pago
- ✅ BadRequestException en pago no encontrado
- ✅ `procesarWebhook()` - Procesamiento de webhooks
- ✅ Retorno null para topic inválido
- ✅ `validarMonto()` - Validación de montos

**Tests File**: `src/pagos/pagos.service.spec.ts`

#### 4. **UsuariosService** (4 tests - Existentes)
- ✅ `crear()` - Creación de usuarios
- ✅ Búsqueda por email
- ✅ Listado de usuarios
- ✅ Servicio definido

**Tests File**: `src/usuarios/usuarios.service.spec.ts`

## 🧪 Cómo Ejecutar Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests específicos
```bash
npm test -- src/auth/auth.service.spec.ts
npm test -- src/pagos/pagos.service.spec.ts
npm test -- src/pedidos/orders.service.spec.ts
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ver cobertura
```bash
npm run test:cov
```

## 📊 Resultados Recientes

```
 PASS  src/pagos/pagos.service.spec.ts
 PASS  src/usuarios/usuarios.service.spec.ts
 PASS  src/auth/auth.service.spec.ts
 PASS  src/pedidos/orders.service.spec.ts

Test Suites: 4 passed, 4 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        4.566 s
```

## 🧬 Casos de Test Principales

### AuthService - Scenarios Probados

**Registro (Register)**
```typescript
✅ Crear nuevo usuario con contraseña hasheada
✅ Rechazar correo duplicado (ConflictException)
✅ No devolver contraseña en respuesta
```

**Login**
```typescript
✅ Generar JWT token con datos de usuario
✅ Rechazar credenciales inválidas (UnauthorizedException)
✅ Comparar contraseña hasheada correctamente
```

**ValidateUser**
```typescript
✅ Validar usuario con contraseña correcta
✅ Retornar null en usuario no encontrado
✅ Retornar null en contraseña incorrecta
✅ No incluir contraseña en resultado
```

### OrdersService - Scenarios Probados

**Crear Pedido**
```typescript
✅ Crear pedido asociado a usuario
✅ Lanzar NotFoundException si usuario no existe
```

**Agregar Productos**
```typescript
✅ Agregar producto a pedido existente
✅ Actualizar stock al agregar
✅ Lanzar BadRequestException si stock insuficiente
✅ Incrementar cantidad si producto ya existe en pedido
```

**Confirmar Pago**
```typescript
✅ Cambiar status a "pagado" si pago approved
✅ Cambiar status a "pendiente" si pago pending
✅ Validar que monto pagado coincida con total
✅ Lanzar BadRequestException si montos no coinciden
```

### PagosService - Scenarios Probados

**Crear Preferencia**
```typescript
✅ Crear preferencia en Mercado Libre
✅ Formatear items correctamente
✅ Incluir datos del comprador
✅ Retornar preferenceId y paymentUrl
✅ Manejar errores de API
✅ Lanzar BadRequestException sin access token
```

**Obtener Pago**
```typescript
✅ Obtener información del pago
✅ Extraer status, monto, email
✅ Manejar errores de API
```

**Procesar Webhook**
```typescript
✅ Procesar webhooks de payment
✅ Retornar null para topic invalido
```

**Validar Monto**
```typescript
✅ Permitir variaciones pequeñas (±0.01)
✅ Rechazar diferencias mayores
```

## 🔧 Mocks Utilizados

### ConfigService
```typescript
{
  get: jest.fn((key) => {
    if (key === 'MERCADO_LIBRE_ACCESS_TOKEN') return 'token';
    if (key === 'APP_URL') return 'http://localhost:3000';
  })
}
```

### Repositories (TypeORM)
```typescript
{
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn()
}
```

### Services
```typescript
{
  findByEmail: jest.fn(),
  crear: jest.fn(),
  sign: jest.fn(),
  obtenerPago: jest.fn(),
  validarMonto: jest.fn()
}
```

### Axios (HTTP)
```typescript
jest.mock('axios');
axios.get = jest.fn().mockResolvedValue({ data: {...} });
axios.post = jest.fn().mockResolvedValue({ data: {...} });
```

## 📈 Próximas Mejoras

- [ ] Tests E2E para flujos completos (register → login → crear pedido → pagar)
- [ ] Tests para controladores (Guards + validación de DTOs)
- [ ] Tests para decoradores (@Roles, @ApiBearerAuth)
- [ ] Coverage report visual
- [ ] Integración con GitHub Actions para tests en PR
- [ ] Tests de performance para operaciones de BD
- [ ] Snapshot tests para respuestas API

## 🚀 Integración CI/CD

Para agregar tests en GitHub Actions:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
```

## 📝 Notas Importantes

1. **Jest Configuration**: Heredada de NestJS, sin cambios especiales
2. **Mocks**: Usamos `jest.fn()` para servicios y repositories
3. **Async/Await**: Todos los tests async están bien manejados
4. **Error Handling**: Probamos excepciones con `.rejects.toThrow()`
5. **Coverage**: Enfocado en lógica de negocio principal

---

**Última actualización**: 2 de Diciembre, 2025  
**Versión**: 1.0  
**Status**: ✅ Todos los tests pasando
