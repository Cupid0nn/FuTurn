import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reserva } from '../../reservas/entidades/reserva.entity';

/**
 * Servicio para validar disponibilidad de reservas
 * Previene doble-booking y conflictos de horarios
 */
@Injectable()
export class ServicioValidacionReservas {
  constructor(
    @InjectRepository(Reserva)
    private readonly repositorioReserva: Repository<Reserva>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Verifica si una cancha está disponible en un horario específico
   */
  async verificarDisponibilidad(
    canchaId: string,
    fechaHora: Date,
    duracionHoras: number = 1,
  ): Promise<boolean> {
    const fechaFin = new Date(fechaHora.getTime() + duracionHoras * 60 * 60 * 1000);

    // Buscar conflictos con reservas confirmadas o pendientes
    const reservasConflictivas = await this.repositorioReserva
      .createQueryBuilder('reserva')
      .where('reserva.canchaId = :canchaId', { canchaId })
      .andWhere('reserva.estado IN (:...estados)', {
        estados: ['confirmada', 'pendiente'],
      })
      .andWhere(
        '(reserva.fechaHora < :fechaFin AND DATE_ADD(reserva.fechaHora, INTERVAL 1 HOUR) > :fechaHora)',
        {
          fechaFin,
          fechaHora,
        },
      )
      .getCount();

    return reservasConflictivas === 0;
  }

  /**
   * Obtiene slots disponibles para una cancha en un día
   */
  async obtenerSlotsDisponibles(
    canchaId: string,
    fecha: Date,
    horarioApertura: number = 8,
    horarioCierre: number = 22,
  ): Promise<Array<{ hora: number; disponible: boolean }>> {
    const slots: Array<{ hora: number; disponible: boolean }> = [];

    // Obtener todas las reservas del día
    const reservasDelDia = await this.repositorioReserva
      .createQueryBuilder('reserva')
      .where('reserva.canchaId = :canchaId', { canchaId })
      .andWhere('DATE(reserva.fechaHora) = :fecha', {
        fecha: fecha.toISOString().split('T')[0],
      })
      .andWhere('reserva.estado IN (:...estados)', {
        estados: ['confirmada', 'pendiente'],
      })
      .getMany();

    // Generar slots para cada hora
    for (let hora = horarioApertura; hora < horarioCierre; hora++) {
      const fechaSlot = new Date(fecha);
      fechaSlot.setHours(hora, 0, 0, 0);

      const fechaFin = new Date(fechaSlot.getTime() + 60 * 60 * 1000);

      const estaOcupado = reservasDelDia.some((reserva) => {
        const reservaFin = new Date(
          reserva.fechaHora.getTime() + 60 * 60 * 1000,
        );
        return fechaSlot < reservaFin && fechaFin > reserva.fechaHora;
      });

      slots.push({
        hora,
        disponible: !estaOcupado,
      });
    }

    return slots;
  }

  /**
   * Valida que la fecha de reserva sea en el futuro
   */
  validarFechaFutura(fecha: Date): boolean {
    const ahora = new Date();
    // Permitir reservar con al menos 30 minutos de anticipación
    const minimo = new Date(ahora.getTime() + 30 * 60 * 1000);
    return fecha > minimo;
  }

  /**
   * Valida que no haya más de 2 semanas de anticipación
   */
  validarFechaMaxima(fecha: Date): boolean {
    const ahora = new Date();
    const maximo = new Date(ahora.getTime() + 14 * 24 * 60 * 60 * 1000);
    return fecha <= maximo;
  }

  /**
   * Valida horario de funcionamiento
   */
  validarHorario(
    hora: number,
    horarioApertura: number = 8,
    horarioCierre: number = 22,
  ): boolean {
    return hora >= horarioApertura && hora < horarioCierre;
  }
}
