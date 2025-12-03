import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entidades/usuario.entity';
import { PedidoProducto } from './pedido-producto.entity';

@Entity({ name: 'pedidos' })
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaPedido: Date;

  @Column({ default: 'pendiente' })
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'entregado';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ nullable: true })
  direccionEntrega: string;

  @Column({ default: 'sin_pagar' })
  statusPago: 'sin_pagar' | 'pendiente' | 'pagado' | 'rechazado';

  @Column({ nullable: true })
  preferenceId: string;

  @Column({ nullable: true })
  paymentId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos, { eager: true })
  usuario: Usuario;

  @OneToMany(() => PedidoProducto, (pp) => pp.pedido, { eager: true })
  productos: PedidoProducto[];
}
