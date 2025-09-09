import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cancha } from './entidades/cancha.entity';
import { CanchasService } from './canchas.service';
import { CanchasController } from './canchas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cancha])],
  controllers: [CanchasController],
  providers: [CanchasService],
  exports: [TypeOrmModule],
})
export class CanchasModule {}
