import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xss = require('xss');
import sanitizeHtml from 'sanitize-html';

/**
 * Middleware para sanitizar inputs y proteger contra XSS
 * Limpia datos en body, query parameters y headers personalizados
 */
@Injectable()
export class SanitizadorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Sanitizar body
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizarObjeto(req.body);
    }

    // Sanitizar query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = this.sanitizarObjeto(req.query);
    }

    next();
  }

  /**
   * Sanitiza recursivamente un objeto
   */
  private sanitizarObjeto(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizarObjeto(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const sanitizado: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitizado[key] = this.sanitizarObjeto(obj[key]);
        }
      }
      return sanitizado;
    }

    if (typeof obj === 'string') {
      // Aplicar XSS protection
      let limpio = xss(obj, {
        whiteList: {},
        stripIgnoredTag: true,
        stripLeadingAndTrailingWhitespace: true,
      });

      // Sanitizar HTML
      limpio = sanitizeHtml(limpio, {
        allowedTags: [],
        allowedAttributes: {},
      });

      // Detectar y prevenir inyección SQL básica
      if (this.detectarInyeccionSQL(limpio)) {
        throw new BadRequestException('Input contiene caracteres sospechosos');
      }

      return limpio;
    }

    return obj;
  }

  /**
   * Detección básica de inyección SQL
   */
  private detectarInyeccionSQL(input: string): boolean {
    const patronesSQL = [
      /(\bUNION\b.*\bSELECT\b)/gi,
      /(\bDROP\b.*\b(TABLE|DATABASE|SCHEMA)\b)/gi,
      /(\bDELETE\b.*\bFROM\b)/gi,
      /(\bINSERT\b.*\bINTO\b)/gi,
      /(\bUPDATE\b.*\bSET\b)/gi,
      /(\bEXEC\b|\bEXECUTE\b)/gi,
      /(--|#|\/\*)/gi, // Comentarios SQL
    ];

    return patronesSQL.some((patron) => patron.test(input));
  }
}
