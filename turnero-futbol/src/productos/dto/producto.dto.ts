import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Pelota de fútbol',
  })
  nombre: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Pelota oficial, talla 5',
  })
  descripcion?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número válido' },
  )
  @Min(0, { message: 'El precio no puede ser negativo' })
  @ApiProperty({ description: 'Precio del producto', example: 1999.99 })
  precio: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Stock disponible', example: 10 })
  stock?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Si el producto está disponible',
    example: true,
  })
  disponible?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://...',
  })
  imagenUrl?: string;
}

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
