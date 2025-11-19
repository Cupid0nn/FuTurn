import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservaDto {
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  fechaHora: Date;

  @IsUUID('4', { message: 'El ID de la cancha debe ser un UUID válido' })
  canchaId: string;

  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsOptional()
  @IsString()
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
}

export class UpdateReservaDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaHora?: Date;

  @IsOptional()
  @IsString()
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
}
