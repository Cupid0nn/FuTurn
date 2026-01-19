import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entidades/reserva.entity';
import { ServicioReservas } from './reservas.service';
import { ControladorReservas } from './reservas.controller';
import { ServicioValidacionReservas } from '../common/services/validation-reservas.service';
import { ServicioLogging } from '../common/services/logging.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  controllers: [ControladorReservas],
  providers: [ServicioReservas, ServicioValidacionReservas, ServicioLogging],
  exports: [TypeOrmModule, ServicioValidacionReservas],
})
export class ModuloReservas {}
