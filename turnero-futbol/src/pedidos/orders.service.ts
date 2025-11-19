import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entidades/pedido.entity';
import { PedidoProducto } from './entidades/pedido-producto.entity';
import { Usuario } from '../usuarios/entidades/usuario.entity';
import { Producto } from '../productos/entidades/producto.entity';
import {
  CreatePedidoDto,
  UpdatePedidoDto,
  AddProductoToPedidoDto,
} from './dto/pedido.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(PedidoProducto)
    private readonly pedidoProductoRepository: Repository<PedidoProducto>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async crear(crearPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: crearPedidoDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const pedido = this.pedidoRepository.create({
      usuario,
      direccionEntrega: crearPedidoDto.direccionEntrega,
      estado: crearPedidoDto.estado || 'pendiente',
      total: 0,
      productos: [],
    });

    return this.pedidoRepository.save(pedido);
  }

  async obtenerTodos(): Promise<Pedido[]> {
    return this.pedidoRepository.find();
  }

  async obtenerPorId(id: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  async obtenerPorUsuario(usuarioId: string): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { usuario: { id: usuarioId } },
    });
  }

  async actualizar(
    id: string,
    updatePedidoDto: UpdatePedidoDto,
  ): Promise<Pedido> {
    const pedido = await this.obtenerPorId(id);

    Object.assign(pedido, updatePedidoDto);

    return this.pedidoRepository.save(pedido);
  }

  async eliminar(id: string): Promise<{ mensaje: string }> {
    const pedido = await this.obtenerPorId(id);
    await this.pedidoRepository.remove(pedido);
    return { mensaje: `Pedido ${id} eliminado correctamente` };
  }

  async agregarProducto(
    pedidoId: string,
    agregarProductoDto: AddProductoToPedidoDto,
  ): Promise<Pedido> {
    const pedido = await this.obtenerPorId(pedidoId);
    const producto = await this.productoRepository.findOne({
      where: { id: agregarProductoDto.productoId },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.stock < agregarProductoDto.cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    // Verificar si el producto ya está en el pedido
    const pedidoProductoExistente = await this.pedidoProductoRepository.findOne(
      {
        where: {
          pedido: { id: pedidoId },
          producto: { id: agregarProductoDto.productoId },
        },
      },
    );

    if (pedidoProductoExistente) {
      pedidoProductoExistente.cantidad += agregarProductoDto.cantidad;
      await this.pedidoProductoRepository.save(pedidoProductoExistente);
    } else {
      const pedidoProducto = this.pedidoProductoRepository.create({
        pedido,
        producto,
        cantidad: agregarProductoDto.cantidad,
        precioUnitario: producto.precio,
      });
      await this.pedidoProductoRepository.save(pedidoProducto);
    }

    // Actualizar stock del producto
    producto.stock -= agregarProductoDto.cantidad;
    await this.productoRepository.save(producto);

    // Recalcular total del pedido
    return await this.recalcularTotal(pedidoId);
  }

  async removerProducto(pedidoId: string, productoId: string): Promise<Pedido> {
    const pedidoProducto = await this.pedidoProductoRepository.findOne({
      where: { pedido: { id: pedidoId }, producto: { id: productoId } },
    });

    if (!pedidoProducto) {
      throw new NotFoundException('Producto no encontrado en el pedido');
    }

    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
    });

    if (producto) {
      // Devolver stock
      producto.stock += pedidoProducto.cantidad;
      await this.productoRepository.save(producto);
    }

    await this.pedidoProductoRepository.remove(pedidoProducto);

    return await this.recalcularTotal(pedidoId);
  }

  private async recalcularTotal(pedidoId: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['productos'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${pedidoId} no encontrado`);
    }

    const total = pedido.productos.reduce((sum, pp) => {
      return sum + Number(pp.precioUnitario) * pp.cantidad;
    }, 0);

    pedido.total = total;
    return this.pedidoRepository.save(pedido);
  }
}
