import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entidades/usuario.entity';
import { ServicioUsuarios } from './usuarios.service';
import { ControladorUsuarios } from './usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [ControladorUsuarios],
  providers: [ServicioUsuarios],
  exports: [TypeOrmModule, ServicioUsuarios],
})
export class ModuloUsuarios {}
