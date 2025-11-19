import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../../productos/entidades/producto.entity';

@Entity({ name: 'pedido_productos' })
export class PedidoProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.productos, {
    onDelete: 'CASCADE',
  })
  pedido: Pedido;

  @ManyToOne(() => Producto, { eager: true })
  producto: Producto;
}
