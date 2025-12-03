import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuario = {
    id: 'user-123',
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    contraseña: '$2b$10$hashedPassword123',
    rol: 'cliente',
  };

  const mockUsuariosService = {
    findByEmail: jest.fn(),
    crear: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario correctamente', async () => {
      const registerDto = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'Password123!',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedPassword123');
      mockUsuariosService.crear.mockResolvedValue({
        ...mockUsuario,
        contraseña: '$2b$10$hashedPassword123',
      });

      const result = await service.register(registerDto);

      expect(mockUsuariosService.findByEmail).toHaveBeenCalledWith(
        registerDto.correo,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.contraseña, 10);
      expect(mockUsuariosService.crear).toHaveBeenCalled();
      expect(result).not.toHaveProperty('contraseña');
    });

    it('debe lanzar ConflictException si el correo ya existe', async () => {
      const registerDto = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'Password123!',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUsuario);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsuariosService.findByEmail).toHaveBeenCalledWith(
        registerDto.correo,
      );
    });
  });

  describe('login', () => {
    it('debe generar token JWT al hacer login correctamente', async () => {
      const loginDto = {
        correo: 'juan@example.com',
        contraseña: 'Password123!',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt_token_123');

      const result = await service.login(loginDto);

      expect(mockUsuariosService.findByEmail).toHaveBeenCalledWith(
        loginDto.correo,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.contraseña,
        mockUsuario.contraseña,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUsuario.id,
        correo: mockUsuario.correo,
        rol: mockUsuario.rol,
      });
      expect(result).toEqual({ access_token: 'jwt_token_123' });
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      const loginDto = {
        correo: 'notfound@example.com',
        contraseña: 'Password123!',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const loginDto = {
        correo: 'juan@example.com',
        contraseña: 'WrongPassword!',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('debe validar usuario correctamente con contraseña válida', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'juan@example.com',
        'Password123!',
      );

      expect(result).not.toHaveProperty('contraseña');
      expect(result?.correo).toBe(mockUsuario.correo);
      expect(result?.rol).toBe(mockUsuario.rol);
    });

    it('debe retornar null si el usuario no existe', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'notfound@example.com',
        'Password123!',
      );

      expect(result).toBeNull();
    });

    it('debe retornar null si la contraseña es incorrecta', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'juan@example.com',
        'WrongPassword!',
      );

      expect(result).toBeNull();
    });
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
});
