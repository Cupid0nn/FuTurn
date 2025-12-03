import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entidades/producto.entity';

@Injectable()
export class ServicioProductos {
  constructor(
    @InjectRepository(Producto)
    private readonly repositorioProducto: Repository<Producto>,
  ) {}

  crear(datos: Partial<Producto>) {
    const nuevoProducto = this.repositorioProducto.create(datos);
    return this.repositorioProducto.save(nuevoProducto);
  }

  obtenerTodos() {
    return this.repositorioProducto.find();
  }

  obtenerPorId(id: string) {
    return this.repositorioProducto.findOne({ where: { id } });
  }

  actualizar(id: string, datos: Partial<Producto>) {
    return this.repositorioProducto.update(id, datos);
  }

  eliminar(id: string) {
    return this.repositorioProducto.delete(id);
  }
}
