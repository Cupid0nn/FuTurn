import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicioPagos } from './pagos.service';
import { ControladorPagos } from './pagos.controller';

@Module({
  imports: [ConfigModule],
  providers: [ServicioPagos],
  controllers: [ControladorPagos],
  exports: [ServicioPagos],
})
export class ModuloPagos {}
