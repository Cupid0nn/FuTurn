import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entidades/producto.entity';
import { ServicioProductos } from './productos.service';
import { ControladorProductos } from './productos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [ControladorProductos],
  providers: [ServicioProductos],
  exports: [TypeOrmModule],
})
export class ModuloProductos {}
