import { IsUUID, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreatePedidoDto {
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @IsOptional()
  @IsString()
  direccionEntrega?: string;

  @IsOptional()
  @IsString()
  estado?: 'pendiente' | 'confirmado' | 'cancelado' | 'entregado';
}

export class UpdatePedidoDto {
  @IsOptional()
  @IsString()
  estado?: 'pendiente' | 'confirmado' | 'cancelado' | 'entregado';

  @IsOptional()
  @IsString()
  direccionEntrega?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;
}

export class AddProductoToPedidoDto {
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  productoId: string;

  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}
