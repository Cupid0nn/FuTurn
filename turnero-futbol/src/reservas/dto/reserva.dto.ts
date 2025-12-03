import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservaDto {
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  @ApiProperty({
    description: 'Fecha y hora de la reserva',
    example: '2025-12-24T19:30:00.000Z',
  })
  fechaHora: Date;

  @IsUUID('4', { message: 'El ID de la cancha debe ser un UUID válido' })
  @ApiProperty({ description: 'ID de la cancha', example: 'c1d2e3f4-...' })
  canchaId: string;

  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @ApiProperty({
    description: 'ID del usuario que reserva',
    example: 'u1v2w3x4-...',
  })
  usuarioId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Estado de la reserva',
    enum: ['pendiente', 'confirmada', 'cancelada'],
  })
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
}

export class UpdateReservaDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description: 'Nueva fecha y hora de la reserva',
    example: '2025-12-25T20:00:00.000Z',
  })
  fechaHora?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nuevo estado de la reserva',
    enum: ['pendiente', 'confirmada', 'cancelada'],
  })
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
}
