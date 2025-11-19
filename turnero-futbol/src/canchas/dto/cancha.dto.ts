import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MinLength,
  Min,
} from 'class-validator';

export class CreateCanchaDto {
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
  precioHora: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
}

export class UpdateCanchaDto {
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
  precioHora?: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
}
