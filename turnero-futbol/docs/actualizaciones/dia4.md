# Día 4 — 24/11/2025

Resumen de tareas realizadas hoy:

- Registré `JwtAuthGuard` y `RolesGuard` como guards globales en `AppModule` para proteger rutas por defecto.
- Agregué decoradores de Swagger (`@ApiProperty`, `@ApiPropertyOptional`, `@ApiTags`, `@ApiBearerAuth`) en DTOs y controladores principales para mejorar la documentación.
- Instalé `morgan`, `@nestjs/swagger` y `swagger-ui-express` y configuré `morgan` + Swagger en `src/main.ts`.
- Habilité CORS en `main.ts` y dejé la configuración preparada para leer `CORS_ORIGIN` desde `.env`.
- Añadí `Roles` decorator y `RolesGuard` para control de acceso por rol (admin/cliente).
- Compilé el proyecto localmente y verifiqué que la build pasa.

Próximos pasos recomendados:

- Añadir `helmet` y `express-rate-limit` para hardening.
- Añadir tests unitarios para `OrdersService` y controladores.
- Registrar migraciones y seeds para la base de datos.
- Proteger endpoints adicionales y afinar permisos por rol.

Notas:
- Swagger está expuesto en `/api/docs` cuando la app esté en ejecución.
- Si querés, puedo dejar el `RolesGuard` no-global y solo aplicarlo en controladores específicos; actualmente está registrado globalmente por conveniencia.

---

Fin del día 4.
