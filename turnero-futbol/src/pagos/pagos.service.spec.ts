import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import axios from 'axios';

jest.mock('axios');

describe('PagosService', () => {
  let service: PagosService;
  let mockConfigService: any;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key) => {
        if (key === 'MERCADO_LIBRE_ACCESS_TOKEN') {
          return 'test_access_token_123';
        }
        if (key === 'APP_URL') {
          return 'http://localhost:3000';
        }
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
    jest.clearAllMocks();
  });

  describe('crearPreferencia', () => {
    it('debe crear una preferencia de pago correctamente', async () => {
      const crearPagoDto = {
        pedidoId: 'pedido-123',
        emailComprador: 'juan@example.com',
        nombreComprador: 'Juan Pérez',
        telefonoComprador: '+541234567890',
        items: [
          {
            descripcion: 'Cancha 5',
            precio: 750,
            cantidad: 2,
          },
        ],
      };

      const mockResponse = {
        data: {
          id: 'pref-123',
          init_point: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=...',
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.crearPreferencia(crearPagoDto);

      expect(axios.post).toHaveBeenCalled();
      expect(result.preferenceId).toBe('pref-123');
      expect(result.paymentUrl).toBeDefined();
    });

    it('debe lanzar BadRequestException si no hay access token', async () => {
      mockConfigService.get.mockReturnValue(null);

      const service2 = new PagosService(mockConfigService);

      const crearPagoDto = {
        pedidoId: 'pedido-123',
        emailComprador: 'juan@example.com',
        nombreComprador: 'Juan Pérez',
        items: [
          {
            descripcion: 'Cancha 5',
            precio: 750,
            cantidad: 1,
          },
        ],
      };

      await expect(service2.crearPreferencia(crearPagoDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debe manejar errores de la API de Mercado Libre', async () => {
      const crearPagoDto = {
        pedidoId: 'pedido-123',
        emailComprador: 'juan@example.com',
        nombreComprador: 'Juan Pérez',
        items: [
          {
            descripcion: 'Cancha 5',
            precio: 750,
            cantidad: 1,
          },
        ],
      };

      (axios.post as jest.Mock).mockRejectedValue(
        new Error('API Error'),
      );

      await expect(service.crearPreferencia(crearPagoDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('obtenerPago', () => {
    it('debe obtener información del pago', async () => {
      const mockResponse = {
        data: {
          id: '12345678',
          status: 'approved',
          status_detail: 'accredited',
          transaction_amount: 2900,
          description: 'Pedido FuTurn',
          external_reference: 'pedido-123',
          payer: {
            email: 'juan@example.com',
          },
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.obtenerPago('12345678');

      expect(axios.get).toHaveBeenCalled();
      expect(result.id).toBe('12345678');
      expect(result.status).toBe('approved');
      expect(result.amount).toBe(2900);
    });

    it('debe lanzar BadRequestException si falla la obtención del pago', async () => {
      (axios.get as jest.Mock).mockRejectedValue(
        new Error('Payment not found'),
      );

      await expect(service.obtenerPago('invalid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('procesarWebhook', () => {
    it('debe procesar webhook de payment correctamente', async () => {
      const mockResponse = {
        data: {
          id: '12345678',
          status: 'approved',
          status_detail: 'accredited',
          transaction_amount: 2900,
          description: 'Pedido FuTurn',
          external_reference: 'pedido-123',
          payer: {
            email: 'juan@example.com',
          },
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.procesarWebhook('payment', '12345678');

      expect(result).toBeDefined();
      expect(result.id).toBe('12345678');
    });

    it('debe retornar null si topic no es payment', async () => {
      const result = await service.procesarWebhook('other_topic', '12345678');

      expect(result).toBeNull();
    });
  });

  describe('validarMonto', () => {
    it('debe validar montos correctamente', () => {
      expect(service.validarMonto(2900, 2900)).toBe(true);
      expect(service.validarMonto(2900, 2900.005)).toBe(true);
      expect(service.validarMonto(2900, 2901)).toBe(false);
    });
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
});
