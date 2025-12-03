import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreatePagoDto } from './dto/pago.dto';

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);
  private readonly mercadoLibreApiUrl = 'https://api.mercadopago.com/v1';
  private accessToken: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.accessToken = this.configService.get<string>(
      'MERCADO_LIBRE_ACCESS_TOKEN',
    );
    if (!this.accessToken) {
      this.logger.warn(
        'MERCADO_LIBRE_ACCESS_TOKEN no configurado. Los pagos no funcionarán.',
      );
    }
  }

  /**
   * Crear una preferencia de pago en Mercado Libre
   * Retorna el URL de pago
   */
  async crearPreferencia(crearPagoDto: CreatePagoDto) {
    try {
      if (!this.accessToken) {
        throw new BadRequestException(
          'Mercado Libre no configurado en el servidor',
        );
      }

      const items = crearPagoDto.items.map((item) => ({
        title: item.descripcion,
        unit_price: parseFloat(item.precio.toString()),
        quantity: item.cantidad,
      }));

      const preferenceData = {
        items,
        payer: {
          email: crearPagoDto.emailComprador,
          name: crearPagoDto.nombreComprador,
          phone: {
            number: crearPagoDto.telefonoComprador || '',
          },
        },
        back_urls: {
          success: `${this.configService.get<string>('APP_URL')}/pagos/success`,
          failure: `${this.configService.get<string>('APP_URL')}/pagos/failure`,
          pending: `${this.configService.get<string>('APP_URL')}/pagos/pending`,
        },
        auto_return: 'approved',
        external_reference: crearPagoDto.pedidoId,
        notification_url: `${this.configService.get<string>('APP_URL')}/pagos/webhook`,
      };

      const response = await axios.post(
        `${this.mercadoLibreApiUrl}/checkout/preferences`,
        preferenceData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      this.logger.log(`Preferencia creada: ${response.data.id}`);

      return {
        preferenceId: response.data.id,
        paymentUrl: response.data.init_point,
      };
    } catch (error) {
      this.logger.error('Error creando preferencia de pago', error.message);
      throw new BadRequestException(
        'Error al crear la preferencia de pago: ' + error.message,
      );
    }
  }

  /**
   * Obtener información de un pago por ID
   */
  async obtenerPago(paymentId: string) {
    try {
      if (!this.accessToken) {
        throw new BadRequestException(
          'Mercado Libre no configurado en el servidor',
        );
      }

      const response = await axios.get(
        `${this.mercadoLibreApiUrl}/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      return {
        id: response.data.id,
        status: response.data.status,
        statusDetail: response.data.status_detail,
        amount: response.data.transaction_amount,
        description: response.data.description,
        externalReference: response.data.external_reference,
        payerEmail: response.data.payer.email,
      };
    } catch (error) {
      this.logger.error('Error obteniendo pago', error.message);
      throw new BadRequestException(
        'Error al obtener el pago: ' + error.message,
      );
    }
  }

  /**
   * Procesar notificación webhook de Mercado Libre
   */
  async procesarWebhook(topic: string, id: string) {
    try {
      if (topic === 'payment') {
        const payment = await this.obtenerPago(id);
        this.logger.log(
          `Webhook recibido - Pago: ${id}, Status: ${payment.status}`,
        );
        return payment;
      }
      return null;
    } catch (error) {
      this.logger.error('Error procesando webhook', error.message);
      throw new BadRequestException('Error en webhook: ' + error.message);
    }
  }

  /**
   * Validar que el monto coincida con el esperado
   */
  validarMonto(montoEsperado: number, montoRecibido: number): boolean {
    // Permitir pequeñas variaciones por redondeo (máximo 0.01)
    return Math.abs(montoEsperado - montoRecibido) <= 0.01;
  }
}
