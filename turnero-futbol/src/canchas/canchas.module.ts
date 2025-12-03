import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cancha } from './entidades/cancha.entity';
import { ServicioCanchas } from './canchas.service';
import { ControladorCanchas } from './canchas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cancha])],
  controllers: [ControladorCanchas],
  providers: [ServicioCanchas],
  exports: [TypeOrmModule],
})
export class ModuloCanchas {}
