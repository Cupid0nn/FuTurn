import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  nombre: string;

  @IsEmail({}, { message: 'Debe ser un email válido' })
  @ApiProperty({
    description: 'Correo electrónico',
    example: 'juan@ejemplo.com',
  })
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @ApiProperty({
    description: 'Contraseña (se almacenará en hash)',
    example: 'contraseña123',
  })
  contraseña: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+5491123456789',
  })
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Av. Siempreviva 742',
  })
  direccion?: string;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @ApiPropertyOptional({ description: 'Nombre actualizado del usuario' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({
    description: 'Nueva contraseña (se almacenará hasheada)',
  })
  contraseña?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Teléfono actualizado' })
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Dirección actualizada' })
  direccion?: string;
}
