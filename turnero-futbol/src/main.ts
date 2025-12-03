import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ModuloApp } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const morgan = require('morgan');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function iniciar() {
  const app = await NestFactory.create<NestExpressApplication>(ModuloApp);
  const servicioConfig = app.get(ConfigService);
  const puerto = servicioConfig.get<number>('PORT') ?? 3000;

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

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: servicioConfig.get<string>('CORS_ORIGIN') ?? '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(morgan('dev'));

  const configSwagger = new DocumentBuilder()
    .setTitle('API Turnero Futbol')
    .setDescription('API para gestión de turnos, reservas y pedidos')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const documentoSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, documentoSwagger);

  await app.listen(puerto);
  console.log(`✓ Servidor ejecutándose en puerto ${puerto}`);
}

void iniciar();
