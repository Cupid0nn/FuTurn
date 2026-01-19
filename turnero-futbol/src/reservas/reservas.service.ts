import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entidades/reserva.entity';
import { ServicioValidacionReservas } from '../common/services/validation-reservas.service';
import { ServicioLogging } from '../common/services/logging.service';

@Injectable()
export class ServicioReservas {
  private readonly logger = new Logger(ServicioReservas.name);

  constructor(
    @InjectRepository(Reserva)
    private readonly repositorioReserva: Repository<Reserva>,
    private readonly servicioValidacion: ServicioValidacionReservas,
    private readonly servicioLogging: ServicioLogging,
  ) {}

  async crear(datos: Partial<Reserva>, usuarioId?: string) {
    try {
      // Validar que fechaHora existe
      if (!datos.fechaHora) {
        throw new BadRequestException('La fecha de la reserva es requerida');
      }

      // Validar fecha en el futuro
      if (!this.servicioValidacion.validarFechaFutura(datos.fechaHora)) {
        throw new BadRequestException(
          'La reserva debe ser con al menos 30 minutos de anticipación',
        );
      }

      // Validar fecha no muy lejana (máximo 2 semanas)
      if (!this.servicioValidacion.validarFechaMaxima(datos.fechaHora)) {
        throw new BadRequestException(
          'Solo se pueden reservar canchas hasta 2 semanas en avance',
        );
      }

      // Validar horario de funcionamiento
      const hora = datos.fechaHora.getHours();
      if (!this.servicioValidacion.validarHorario(hora)) {
        throw new BadRequestException(
          'Las reservas son entre 8:00 y 22:00 horas',
        );
      }

      // Verificar disponibilidad
      const canchaId = datos.cancha?.id || (datos as any).canchaId;
      if (!canchaId) {
        throw new BadRequestException('La cancha es requerida');
      }

      const disponible = await this.servicioValidacion.verificarDisponibilidad(
        canchaId,
        datos.fechaHora,
      );

      if (!disponible) {
        throw new BadRequestException(
          'La cancha no está disponible en este horario',
        );
      }

      const nuevaReserva = this.repositorioReserva.create(datos);
      const resultado = await this.repositorioReserva.save(nuevaReserva);

      // Log de auditoría
      if (usuarioId) {
        this.servicioLogging.audit('RESERVA_CREADA', usuarioId, {
          reservaId: resultado.id,
          cancha: canchaId,
          fecha: datos.fechaHora,
        });
      }

      return resultado;
    } catch (error) {
      this.servicioLogging.error('Error creando reserva', error as Error, {
        usuarioId,
        datos,
      });
      throw error;
    }
  }

  obtenerTodas() {
    return this.repositorioReserva.find();
  }

  obtenerPorId(id: string) {
    return this.repositorioReserva.findOne({ where: { id } });
  }

  async actualizar(id: string, datos: Partial<Reserva>, usuarioId?: string) {
    try {
      // Si se actualiza la fecha, validar nuevamente
      if (datos.fechaHora) {
        if (!this.servicioValidacion.validarFechaFutura(datos.fechaHora)) {
          throw new BadRequestException(
            'La reserva debe ser con al menos 30 minutos de anticipación',
          );
        }

        const canchaId = datos.cancha?.id;
        if (canchaId) {
          const disponible = await this.servicioValidacion.verificarDisponibilidad(
            canchaId,
            datos.fechaHora,
          );

          if (!disponible) {
            throw new BadRequestException(
              'La cancha no está disponible en este horario',
            );
          }
        }
      }

      await this.repositorioReserva.update(id, datos);

      if (usuarioId) {
        this.servicioLogging.audit('RESERVA_ACTUALIZADA', usuarioId, {
          reservaId: id,
        });
      }

      return this.obtenerPorId(id);
    } catch (error) {
      this.servicioLogging.error('Error actualizando reserva', error as Error, {
        usuarioId,
        reservaId: id,
      });
      throw error;
    }
  }

  async eliminar(id: string, usuarioId?: string) {
    try {
      const reserva = await this.obtenerPorId(id);

      if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
      }

      // Solo permitir cancelar reservas pendientes o confirmadas
      if (!['pendiente', 'confirmada'].includes(reserva.estado)) {
        throw new BadRequestException(
          'No se puede cancelar esta reserva en su estado actual',
        );
      }

      await this.repositorioReserva.delete(id);

      if (usuarioId) {
        this.servicioLogging.audit('RESERVA_CANCELADA', usuarioId, {
          reservaId: id,
        });
      }

      return { mensaje: `Reserva ${id} cancelada correctamente` };
    } catch (error) {
      this.servicioLogging.error('Error eliminando reserva', error as Error, {
        usuarioId,
        reservaId: id,
      });
      throw error;
    }
  }

  /**
   * Obtiene slots disponibles para una cancha en una fecha específica
   */
  async obtenerDisponibilidad(canchaId: string, fecha: Date) {
    return this.servicioValidacion.obtenerSlotsDisponibles(canchaId, fecha);
  }
}
