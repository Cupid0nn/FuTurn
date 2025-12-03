import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioPedidos } from './orders.service';
import { ControladorPedidos } from './orders.controller';
import { Pedido } from './entidades/pedido.entity';
import { PedidoProducto } from './entidades/pedido-producto.entity';
import { Usuario } from '../usuarios/entidades/usuario.entity';
import { Producto } from '../productos/entidades/producto.entity';
import { ModuloPagos } from '../pagos/pagos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoProducto, Usuario, Producto]),
    ModuloPagos,
  ],
  controllers: [ControladorPedidos],
  providers: [ServicioPedidos],
  exports: [TypeOrmModule],
})
export class ModuloPedidos {}
