import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { Reserva } from './entidades/reserva.entity';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  crear(@Body() datos: Partial<Reserva>) {
    return this.reservasService.crear(datos);
  }

  @Get()
  obtenerTodas() {
    return this.reservasService.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.reservasService.obtenerPorId(id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() datos: Partial<Reserva>) {
    return this.reservasService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.reservasService.eliminar(id);
  }
}
