import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Servicio centralizado de logging
 * Registra eventos, errores y auditoría
 */
@Injectable()
export class ServicioLogging {
  private logger: winston.Logger;

  constructor() {
    // Crear directorio de logs si no existe
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Configurar Winston
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'futurn-api' },
      transports: [
        // Errores en archivo separado
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),
        // Todos los logs en archivo general
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),
        // Logs de auditoría (acciones de usuario)
        new winston.transports.File({
          filename: path.join(logsDir, 'audit.log'),
          level: 'info',
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),
      ],
    });

    // Console en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, timestamp, ...meta }) => {
                const metaStr = Object.keys(meta).length
                  ? ` ${JSON.stringify(meta)}`
                  : '';
                return `${timestamp} [${level}]: ${message}${metaStr}`;
              },
            ),
          ),
        }),
      );
    }
  }

  /**
   * Log de información general
   */
  info(mensaje: string, metadata?: any) {
    this.logger.info(mensaje, metadata);
  }

  /**
   * Log de errores
   */
  error(mensaje: string, error?: any, metadata?: any) {
    this.logger.error(mensaje, {
      stack: error?.stack,
      errorMessage: error?.message,
      ...metadata,
    });
  }

  /**
   * Log de auditoría (acciones de usuario)
   */
  audit(accion: string, usuarioId: string, detalles?: any) {
    this.logger.info(`AUDIT: ${accion}`, {
      usuarioId,
      accion,
      timestamp: new Date().toISOString(),
      detalles,
    });
  }

  /**
   * Log de autenticación
   */
  logAutenticacion(correo: string, exitoso: boolean, razon?: string) {
    const nivel = exitoso ? 'info' : 'warn';
    this.logger[nivel](`AUTH: ${exitoso ? 'Login exitoso' : 'Login fallido'}`, {
      correo,
      exitoso,
      razon,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log de transacciones de pago
   */
  logPago(
    pedidoId: string,
    monto: number,
    estado: string,
    detalles?: any,
  ) {
    this.logger.info('PAYMENT: Transacción procesada', {
      pedidoId,
      monto,
      estado,
      timestamp: new Date().toISOString(),
      detalles,
    });
  }

  /**
   * Log de errores de seguridad
   */
  logSeguridadError(tipo: string, ip?: string, metadata?: any) {
    this.logger.error(`SECURITY: ${tipo}`, {
      tipo,
      ip,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  /**
   * Log de operaciones en BD
   */
  logDB(operacion: string, tabla: string, resultado: string, error?: any) {
    const nivel = resultado === 'exito' ? 'info' : 'error';
    this.logger[nivel](`DB: ${operacion} en ${tabla}`, {
      operacion,
      tabla,
      resultado,
      error: error?.message,
      timestamp: new Date().toISOString(),
    });
  }
}
