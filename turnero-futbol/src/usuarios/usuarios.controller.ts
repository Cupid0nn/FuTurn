import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crear(@Body() crearUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crear(crearUsuarioDto);
  }

  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usuariosService.obtenerPorId(id);
  }
}
