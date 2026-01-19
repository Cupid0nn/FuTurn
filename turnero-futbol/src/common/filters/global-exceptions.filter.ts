import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ServicioLogging } from '../services/logging.service';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error?: string;
  requestId?: string;
}

/**
 * Filter mejorado para manejar excepciones de forma segura
 * No expone detalles internos en producción
 */
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  constructor(private readonly servicioLogging: ServicioLogging) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.headers['x-request-id'] as string;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';
    let error = 'Internal Server Error';
    let isProduction = process.env.NODE_ENV === 'production';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const exceptionObj = exceptionResponse as Record<string, unknown>;
        message =
          (exceptionObj.message as string | string[]) || exception.message;
        error = (exceptionObj.error as string) || exception.message;
      } else {
        message = exception.message;
      }

      // Log de errores HTTP
      this.servicioLogging.logSeguridadError('HTTP_ERROR', request.ip, {
        status,
        method: request.method,
        path: request.path,
        message,
        requestId,
      });
    } else if (exception instanceof Error) {
      message = isProduction
        ? 'Error interno del servidor'
        : exception.message;
      error = exception.constructor.name;

      // Log de errores no controlados
      this.servicioLogging.error('UNHANDLED_ERROR', exception, {
        path: request.path,
        method: request.method,
        ip: request.ip,
        requestId,
      });
    }

    // En producción, no exponer detalles internos
    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Ha ocurrido un error. Por favor intenta más tarde.';
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      requestId,
      ...(status === HttpStatus.BAD_REQUEST && { error }),
    };

    response.status(status).json(errorResponse);
  }
}
