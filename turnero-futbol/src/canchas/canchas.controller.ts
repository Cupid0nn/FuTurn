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
import { ServicioCanchas } from './canchas.service';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';

@Controller('canchas')
export class ControladorCanchas {
  constructor(private readonly servicioCanchas: ServicioCanchas) {}

  @Post()
  crear(@Body() crearCanchaDto: CreateCanchaDto) {
    return this.servicioCanchas.crear(crearCanchaDto);
  }

  @Get()
  obtenerTodas() {
    return this.servicioCanchas.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioCanchas.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCanchaDto: UpdateCanchaDto,
  ) {
    return this.servicioCanchas.actualizar(id, updateCanchaDto);
  }

  @Delete(':id')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioCanchas.eliminar(id);
  }
}
