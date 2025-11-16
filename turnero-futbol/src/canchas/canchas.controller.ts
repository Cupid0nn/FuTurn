import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CanchasService } from './canchas.service';
import { Cancha } from './entidades/cancha.entity';

@Controller('canchas')
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}

  @Post()
  crear(@Body() datos: Partial<Cancha>) {
    return this.canchasService.crear(datos);
  }

  @Get()
  obtenerTodas() {
    return this.canchasService.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.canchasService.obtenerPorId(id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() datos: Partial<Cancha>) {
    return this.canchasService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.canchasService.eliminar(id);
  }
}
