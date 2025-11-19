import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.listen(port);
  console.log(`✓ Servidor ejecutándose en puerto ${port}`);
}

void bootstrap();
