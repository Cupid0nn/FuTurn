import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
const morgan = require('morgan');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  // Aplicar ValidationPipe global para DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remover propiedades no definidas en DTO
      forbidNonWhitelisted: true, // rechazar propiedades no definidas
      transform: true, // transformar datos según tipos de DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Aplicar exception filter global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Habilitar CORS con opciones básicas seguras
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') ?? '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Logging HTTP con morgan
  app.use(morgan('dev'));

  // Configurar Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Turnero Futbol API')
    .setDescription('API para gestión de turnos, reservas y pedidos')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(port);
  console.log(`✓ Servidor ejecutándose en puerto ${port}`);
}

void bootstrap();
