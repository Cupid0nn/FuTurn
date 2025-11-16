# Guía de Configuración - FuTurn

## 📝 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado (o Docker)
- npm instalado

## 🔧 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env` y ajusta los valores según tu ambiente:

```bash
cp .env.example .env
```

Edita el archivo `.env`:
```properties
# Base de Datos - PostgreSQL
DB_HOST=localhost          # Host de PostgreSQL
DB_PORT=5432              # Puerto de PostgreSQL (default: 5432)
DB_USERNAME=postgres      # Usuario de PostgreSQL
DB_PASSWORD=postgres      # Contraseña de PostgreSQL
DB_NAME=futurn_db         # Nombre de la base de datos

# Servidor
PORT=3000                 # Puerto del servidor NestJS
NODE_ENV=development      # Ambiente (development, production)
```

## 🗄️ Base de Datos

### Opción 1: PostgreSQL Local
Si ya tenés PostgreSQL instalado localmente, solo asegúrate de que el usuario y contraseña coincidan con los del `.env`.

### Opción 2: PostgreSQL con Docker
Si tenés Docker instalado, levanta PostgreSQL con:

```bash
docker compose up -d
```

Esto levantará:
- **PostgreSQL** en puerto 5432
- **PgAdmin** (interfaz web) en http://localhost:5050
  - Email: admin@futurn.com
  - Contraseña: admin

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo (con watch)
```bash
npm run start:dev
```

### Modo Producción
```bash
npm run build
npm run start:prod
```

### Modo Debug
```bash
npm run start:debug
```

## 🧪 Tests

### Ejecutar Tests Unitarios
```bash
npm test
```

### Tests con Coverage
```bash
npm test:cov
```

### Tests en Watch Mode
```bash
npm test:watch
```

### Tests E2E
```bash
npm test:e2e
```

## 📋 Otros Scripts

```bash
# Formatear código
npm run format

# Linting (ESLint)
npm run lint

# Compilar proyecto
npm run build
```

## 📚 Rutas API Disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/usuarios` | Crear usuario |
| GET | `/usuarios` | Obtener todos los usuarios |
| POST | `/reservas` | Crear reserva |
| GET | `/reservas` | Obtener todas las reservas |
| GET | `/reservas/:id` | Obtener reserva por ID |
| PATCH | `/reservas/:id` | Actualizar reserva |
| DELETE | `/reservas/:id` | Eliminar reserva |

## 🐛 Troubleshooting

### Error: "Unable to connect to the database"
- Verifica que PostgreSQL esté corriendo
- Asegúrate de que las credenciales en `.env` sean correctas
- Si usas Docker: `docker ps` para verificar que el contenedor esté corriendo

### Error: "No driver (HTTP) has been selected"
```bash
npm install @nestjs/platform-express
```

### Puerto 3000 en uso
Cambia el puerto en `.env`:
```properties
PORT=3001
```

## 📖 Documentación

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
