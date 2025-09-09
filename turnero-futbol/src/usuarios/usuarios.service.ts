import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entidades/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorioUsuario: Repository<Usuario>,
  ) {}

  crear(datos: Partial<Usuario>) {
    const nuevoUsuario = this.repositorioUsuario.create(datos);
    return this.repositorioUsuario.save(nuevoUsuario);
  }

  obtenerTodos() {
    return this.repositorioUsuario.find();
  }
}
