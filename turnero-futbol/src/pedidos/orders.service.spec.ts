import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ServicioPedidos } from './orders.service';
import { Pedido } from './entidades/pedido.entity';
import { PedidoProducto } from './entidades/pedido-producto.entity';
import { Usuario } from '../usuarios/entidades/usuario.entity';
import { Producto } from '../productos/entidades/producto.entity';
import { ServicioPagos } from '../pagos/pagos.service';

describe('ServicioPedidos', () => {
  let service: ServicioPedidos;
  let mockPedidoRepository: any;
  let mockPedidoProductoRepository: any;
  let mockUsuarioRepository: any;
  let mockProductoRepository: any;
  let mockServicioPagos: any;

  const mockPedido = {
    id: 'pedido-123',
    fechaPedido: new Date(),
    estado: 'pendiente',
    statusPago: 'sin_pagar',
    total: 1500,
    direccionEntrega: 'Av. Test 123',
    usuario: { id: 'user-123' },
    productos: [],
  };

  const mockUsuario = {
    id: 'user-123',
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    rol: 'cliente',
  };

  const mockProducto = {
    id: 'prod-123',
    nombre: 'Cancha 5',
    precio: 750,
    stock: 10,
    disponible: true,
  };

  beforeEach(async () => {
    mockPedidoRepository = {
      create: jest.fn().mockReturnValue(mockPedido),
      save: jest.fn().mockResolvedValue(mockPedido),
      find: jest.fn().mockResolvedValue([mockPedido]),
      findOne: jest.fn().mockResolvedValue(mockPedido),
      remove: jest.fn().mockResolvedValue(mockPedido),
    };

    mockPedidoProductoRepository = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockResolvedValue({}),
      findOne: jest.fn().mockResolvedValue(null),
      remove: jest.fn().mockResolvedValue({}),
    };

    mockUsuarioRepository = {
      findOne: jest.fn().mockResolvedValue(mockUsuario),
    };

    mockProductoRepository = {
      findOne: jest.fn().mockResolvedValue(mockProducto),
      save: jest.fn().mockResolvedValue(mockProducto),
    };

    mockServicioPagos = {
      obtenerPago: jest.fn(),
      validarMonto: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicioPedidos,
        {
          provide: getRepositoryToken(Pedido),
          useValue: mockPedidoRepository,
        },
        {
          provide: getRepositoryToken(PedidoProducto),
          useValue: mockPedidoProductoRepository,
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductoRepository,
        },
        {
          provide: ServicioPagos,
          useValue: mockServicioPagos,
        },
      ],
    }).compile();

    service = module.get<ServicioPedidos>(ServicioPedidos);
    jest.clearAllMocks();
  });

  describe('crear', () => {
    it('debe crear un nuevo pedido', async () => {
      const crearPedidoDto = {
        usuarioId: 'user-123',
        direccionEntrega: 'Av. Test 123',
      };

      const result = await service.crear(crearPedidoDto as any);

      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(mockPedidoRepository.create).toHaveBeenCalled();
      expect(mockPedidoRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('debe lanzar NotFoundException si usuario no existe', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      const crearPedidoDto = {
        usuarioId: 'user-invalid',
        direccionEntrega: 'Av. Test 123',
      };

      await expect(service.crear(crearPedidoDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('obtenerTodos', () => {
    it('debe retornar todos los pedidos', async () => {
      const result = await service.obtenerTodos();

      expect(mockPedidoRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar un pedido por id', async () => {
      const result = await service.obtenerPorId('pedido-123');

      expect(mockPedidoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'pedido-123' },
      });
      expect(result).toBeDefined();
    });

    it('debe lanzar NotFoundException si pedido no existe', async () => {
      mockPedidoRepository.findOne.mockResolvedValue(null);

      await expect(service.obtenerPorId('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('obtenerPorUsuario', () => {
    it('debe retornar pedidos de un usuario', async () => {
      const result = await service.obtenerPorUsuario('user-123');

      expect(mockPedidoRepository.find).toHaveBeenCalledWith({
        where: { usuario: { id: 'user-123' } },
      });
      expect(result).toBeDefined();
    });
  });

  describe('agregarProducto', () => {
    it('debe agregar producto a pedido', async () => {
      const agregarProductoDto = {
        productoId: 'prod-123',
        cantidad: 2,
      };

      mockPedidoProductoRepository.findOne.mockResolvedValue(null);
      mockPedidoRepository.findOne.mockResolvedValue({
        ...mockPedido,
        productos: [],
      });

      await service.agregarProducto('pedido-123', agregarProductoDto);

      expect(mockProductoRepository.findOne).toHaveBeenCalled();
      expect(mockPedidoProductoRepository.create).toHaveBeenCalled();
      expect(mockProductoRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si stock insuficiente', async () => {
      mockProductoRepository.findOne.mockResolvedValue({
        ...mockProducto,
        stock: 1,
      });

      const agregarProductoDto = {
        productoId: 'prod-123',
        cantidad: 5,
      };

      await expect(
        service.agregarProducto('pedido-123', agregarProductoDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirmarPago', () => {
    it('debe confirmar pago y actualizar estado del pedido', async () => {
      const mockPago = {
        status: 'approved',
        amount: 1500,
      };

      mockServicioPagos.obtenerPago.mockResolvedValue(mockPago);
      mockPedidoRepository.findOne.mockResolvedValue(mockPedido);

      const result = await service.confirmarPago('pedido-123', 'pay-123');

      expect(mockServicioPagos.obtenerPago).toHaveBeenCalledWith('pay-123');
      expect(mockServicioPagos.validarMonto).toHaveBeenCalled();
      expect(result.statusPago).toBe('pagado');
      expect(result.estado).toBe('confirmado');
    });

    it('debe lanzar BadRequestException si montos no coinciden', async () => {
      mockServicioPagos.validarMonto.mockReturnValue(false);
      mockServicioPagos.obtenerPago.mockResolvedValue({
        status: 'approved',
        amount: 2000,
      });

      await expect(
        service.confirmarPago('pedido-123', 'pay-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe actualizar statusPago a pendiente si pago está pending', async () => {
      const mockPago = {
        status: 'pending',
        amount: 1500,
      };

      mockServicioPagos.obtenerPago.mockResolvedValue(mockPago);
      mockPedidoRepository.findOne.mockResolvedValue(mockPedido);

      const result = await service.confirmarPago('pedido-123', 'pay-123');

      expect(result.statusPago).toBe('pendiente');
    });
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
});
