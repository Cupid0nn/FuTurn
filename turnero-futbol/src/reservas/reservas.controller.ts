import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  crear(@Body() crearReservaDto: CreateReservaDto) {
    return this.reservasService.crear(crearReservaDto);
  }

  @Get()
  obtenerTodas() {
    return this.reservasService.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservasService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return this.reservasService.actualizar(id, updateReservaDto);
  }

  @Delete(':id')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservasService.eliminar(id);
  }
}
