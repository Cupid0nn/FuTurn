import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServicioUsuarios } from './usuarios.service';
import { Usuario } from './entidades/usuario.entity';

describe('ServicioUsuarios', () => {
  let service: ServicioUsuarios;
  let mockRepository: any;

  const mockUsuario = {
    id: '1',
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    contraseña: 'hashedPassword123',
    rol: 'cliente',
    telefono: '1234567890',
    direccion: 'Av. Siempre Viva 123',
    reservas: [],
    pedidos: [],
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockReturnValue(mockUsuario),
      save: jest.fn().mockResolvedValue(mockUsuario),
      find: jest.fn().mockResolvedValue([mockUsuario]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicioUsuarios,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServicioUsuarios>(ServicioUsuarios);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('crear', () => {
    it('debe crear un nuevo usuario', async () => {
      const datos = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'hashedPassword123',
      };

      const resultado = await service.crear(datos);

      expect(mockRepository.create).toHaveBeenCalledWith(datos);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUsuario);
      expect(resultado).toEqual(mockUsuario);
    });
  });

  describe('obtenerTodos', () => {
    it('debe obtener todos los usuarios', async () => {
      const resultado = await service.obtenerTodos();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(resultado).toEqual([mockUsuario]);
      expect(Array.isArray(resultado)).toBe(true);
    });
  });
});
