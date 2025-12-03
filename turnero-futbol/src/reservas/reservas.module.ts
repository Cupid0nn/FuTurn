import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entidades/reserva.entity';
import { ServicioReservas } from './reservas.service';
import { ControladorReservas } from './reservas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  controllers: [ControladorReservas],
  providers: [ServicioReservas],
  exports: [TypeOrmModule],
})
export class ModuloReservas {}
