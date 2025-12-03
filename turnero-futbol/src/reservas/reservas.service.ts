import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entidades/reserva.entity';

@Injectable()
export class ServicioReservas {
  constructor(
    @InjectRepository(Reserva)
    private readonly repositorioReserva: Repository<Reserva>,
  ) {}

  crear(datos: Partial<Reserva>) {
    const nuevaReserva = this.repositorioReserva.create(datos);
    return this.repositorioReserva.save(nuevaReserva);
  }

  obtenerTodas() {
    return this.repositorioReserva.find();
  }

  obtenerPorId(id: string) {
    return this.repositorioReserva.findOne({ where: { id } });
  }

  actualizar(id: string, datos: Partial<Reserva>) {
    return this.repositorioReserva.update(id, datos);
  }

  eliminar(id: string) {
    return this.repositorioReserva.delete(id);
  }
}
