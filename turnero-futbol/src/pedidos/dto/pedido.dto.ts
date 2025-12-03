import { IsUUID, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePedidoDto {
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @ApiProperty({
    description: 'ID del usuario que realiza el pedido',
    example: 'a1b2c3d4-...',
  })
  usuarioId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Dirección de entrega',
    example: 'Calle Falsa 123',
  })
  direccionEntrega?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Estado del pedido',
    example: 'pendiente',
    enum: ['pendiente', 'confirmado', 'cancelado', 'entregado'],
  })
  estado?: 'pendiente' | 'confirmado' | 'cancelado' | 'entregado';
}

export class UpdatePedidoDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Estado del pedido a actualizar',
    enum: ['pendiente', 'confirmado', 'cancelado', 'entregado'],
  })
  estado?: 'pendiente' | 'confirmado' | 'cancelado' | 'entregado';

  @IsOptional()
  @IsString()
  direccionEntrega?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Total del pedido en moneda local',
    example: 1500,
  })
  total?: number;
}

export class AddProductoToPedidoDto {
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  @ApiProperty({
    description: 'ID del producto a agregar',
    example: 'p1q2r3s4-...',
  })
  productoId: string;

  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  cantidad: number;
}
