import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entidades/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crear(@Body() datos: Partial<Usuario>) {
    return this.usuariosService.crear(datos);
  }

  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }
}
