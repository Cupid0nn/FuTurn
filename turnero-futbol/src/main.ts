import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ModuloApp } from './app.module';
import { GlobalExceptionsFilter } from './common/filters/global-exceptions.filter';
import { SanitizadorMiddleware } from './common/filters/sanitizer.filter';
import { ServicioLogging } from './common/services/logging.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const morgan = require('morgan');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rateLimit = require('express-rate-limit');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function iniciar() {
  const app = await NestFactory.create<NestExpressApplication>(ModuloApp);
  const servicioConfig = app.get(ConfigService);
  const servicioLogging = app.get(ServicioLogging);
  const puerto = servicioConfig.get<number>('PORT') ?? 3000;

  // Security: Helmet para headers HTTP seguros
  app.use(helmet());

  // Security: Rate limiting para prevenir fuerza bruta
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: 'Demasiadas solicitudes, intenta más tarde',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Aplicar rate limiting a rutas de autenticación (más estricto)
  const limiterAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // máximo 5 intentos de login
    message:
      'Demasiados intentos de login. Intenta en 15 minutos',
    skipSuccessfulRequests: true, // no contar intentos exitosos
  });

  app.use(limiter);
  app.use('/autenticacion', limiterAuth);

  // Sanitización de inputs
  app.use(SanitizadorMiddleware);

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Exception filter global mejorado
  app.useGlobalFilters(new GlobalExceptionsFilter(servicioLogging));

  // CORS configurado
  app.enableCors({
    origin: servicioConfig.get<string>('CORS_ORIGIN') ?? '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Morgan para logging HTTP
  app.use(morgan('combined'));

  // Agregar request ID para tracing
  app.use((req: any, res: any, next: any) => {
    req.headers['x-request-id'] =
      req.headers['x-request-id'] || 
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    next();
  });

  // Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('API Turnero Futbol')
    .setDescription('API para gestión de turnos, reservas y pedidos - Segura y confiable')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const documentoSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, documentoSwagger);

  await app.listen(puerto);
  servicioLogging.info(`✓ Servidor ejecutándose en puerto ${puerto}`);
  servicioLogging.info(`✓ Documentación: http://localhost:${puerto}/api/docs`);
}

void iniciar();
