import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MinLength,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número válido' },
  )
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;

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
