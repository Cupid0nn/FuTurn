import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';

@Module({
  imports: [ConfigModule],
  providers: [PagosService],
  controllers: [PagosController],
  exports: [PagosService],
})
export class PagosModule {}
