import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancha } from './entidades/cancha.entity';

@Injectable()
export class CanchasService {
  constructor(
    @InjectRepository(Cancha)
    private readonly repositorioCancha: Repository<Cancha>,
  ) {}

  crear(datos: Partial<Cancha>) {
    const nuevaCancha = this.repositorioCancha.create(datos);
    return this.repositorioCancha.save(nuevaCancha);
  }

  obtenerTodas() {
    return this.repositorioCancha.find();
  }

  obtenerPorId(id: string) {
    return this.repositorioCancha.findOne({ where: { id } });
  }

  actualizar(id: string, datos: Partial<Cancha>) {
    return this.repositorioCancha.update(id, datos);
  }

  eliminar(id: string) {
    return this.repositorioCancha.delete(id);
  }
}
