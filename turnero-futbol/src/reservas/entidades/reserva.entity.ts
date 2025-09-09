import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../../usuarios/entidades/usuario.entity';
import { Cancha } from '../../canchas/entidades/cancha.entity';

@Entity({ name: 'reservas' })
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  fechaHora: Date;

  @Column({ default: 'pendiente' })
  estado: 'pendiente' | 'confirmada' | 'cancelada';

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { eager: true })
  usuario: Usuario;

  @ManyToOne(() => Cancha, (cancha) => cancha.reservas, { eager: true })
  cancha: Cancha;
}
