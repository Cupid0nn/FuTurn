import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServicioUsuarios } from './usuarios.service';
import { CreateUsuarioDto } from './dto/usuario.dto';

@Controller('usuarios')
export class ControladorUsuarios {
  constructor(private readonly servicioUsuarios: ServicioUsuarios) {}

  @Post()
  crear(@Body() crearUsuarioDto: CreateUsuarioDto) {
    return this.servicioUsuarios.crear(crearUsuarioDto);
  }

  @Get()
  obtenerTodos() {
    return this.servicioUsuarios.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioUsuarios.obtenerPorId(id);
  }
}
