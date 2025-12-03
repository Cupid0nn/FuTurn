import {
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemPagoDto {
  @ApiProperty({ example: 'Cancha 5 - 2 horas' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0.01)
  precio: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class CreatePagoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  pedidoId: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  emailComprador: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  nombreComprador: string;

  @ApiPropertyOptional({ example: '+541234567890' })
  @IsOptional()
  @IsString()
  telefonoComprador?: string;

  @ApiProperty({ type: [ItemPagoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPagoDto)
  items: ItemPagoDto[];
}

export class ConfirmarPagoDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  paymentId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  pedidoId: string;
}

export class WebhookDto {
  @ApiProperty({ example: 'payment' })
  @IsString()
  topic: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  id: string;
}
