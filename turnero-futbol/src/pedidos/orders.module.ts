import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Pedido } from './entidades/pedido.entity';
import { PedidoProducto } from './entidades/pedido-producto.entity';
import { Usuario } from '../usuarios/entidades/usuario.entity';
import { Producto } from '../productos/entidades/producto.entity';
import { PagosModule } from '../pagos/pagos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoProducto, Usuario, Producto]),
    PagosModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
