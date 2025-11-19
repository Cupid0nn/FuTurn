import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entidades/usuario.entity';
import { CreateUsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorioUsuario: Repository<Usuario>,
  ) {}

  crear(crearUsuarioDto: CreateUsuarioDto) {
    const nuevoUsuario = this.repositorioUsuario.create(crearUsuarioDto);
    return this.repositorioUsuario.save(nuevoUsuario);
  }

  obtenerTodos() {
    return this.repositorioUsuario.find();
  }

  async obtenerPorId(id: string): Promise<Usuario> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }
}
