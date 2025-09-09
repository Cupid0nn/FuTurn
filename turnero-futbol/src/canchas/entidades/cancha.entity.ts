import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../../reservas/entidades/reserva.entity';

@Entity({ name: 'canchas' })
export class Cancha {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  disponible: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioHora: number;

  @OneToMany(() => Reserva, (reserva) => reserva.cancha)
  reservas: Reserva[];
}
