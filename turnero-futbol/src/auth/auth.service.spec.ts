import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ServicioAutenticacion } from './auth.service';
import { ServicioUsuarios } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ServicioAutenticacion', () => {
  let service: ServicioAutenticacion;

  const mockUsuario = {
    id: 'user-123',
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    contraseña: '$2b$10$hashedPassword123',
    rol: 'cliente',
  };

  const mockServicioUsuarios = {
    findByEmail: jest.fn(),
    crear: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicioAutenticacion,
        {
          provide: ServicioUsuarios,
          useValue: mockServicioUsuarios,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<ServicioAutenticacion>(ServicioAutenticacion);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario correctamente', async () => {
      const registroDto = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'Password123!',
      };

      mockServicioUsuarios.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedPassword123');
      mockServicioUsuarios.crear.mockResolvedValue({
        ...mockUsuario,
        contraseña: '$2b$10$hashedPassword123',
      });

      const result = await service.register(registroDto);

      expect(mockServicioUsuarios.findByEmail).toHaveBeenCalledWith(
        registroDto.correo,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registroDto.contraseña, 10);
      expect(mockServicioUsuarios.crear).toHaveBeenCalled();
      expect(result).not.toHaveProperty('contraseña');
    });

    it('debe lanzar ConflictException si el correo ya existe', async () => {
      const registroDto = {
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: 'Password123!',
      };

      mockServicioUsuarios.findByEmail.mockResolvedValue(mockUsuario);

      await expect(service.register(registroDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockServicioUsuarios.findByEmail).toHaveBeenCalledWith(
        registroDto.correo,
      );
    });
  });

  describe('iniciarSesion', () => {
    it('debe generar token JWT al hacer login correctamente', async () => {
      const inicioSesionDto = {
        correo: 'juan@example.com',
        contraseña: 'Password123!',
      };

      mockServicioUsuarios.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt_token_123');

      const result = await service.iniciarSesion(inicioSesionDto);

      expect(mockServicioUsuarios.findByEmail).toHaveBeenCalledWith(
        inicioSesionDto.correo,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        inicioSesionDto.contraseña,
        mockUsuario.contraseña,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUsuario.id,
        correo: mockUsuario.correo,
        rol: mockUsuario.rol,
      });
      expect(result).toEqual({ token_acceso: 'jwt_token_123' });
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      const inicioSesionDto = {
        correo: 'notfound@example.com',
        contraseña: 'Password123!',
      };

      mockServicioUsuarios.findByEmail.mockResolvedValue(null);

      await expect(service.iniciarSesion(inicioSesionDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const inicioSesionDto = {
        correo: 'juan@example.com',
        contraseña: 'WrongPassword!',
      };

      mockServicioUsuarios.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.iniciarSesion(inicioSesionDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validarUsuario', () => {
    it('debe validar usuario correctamente con contraseña válida', async () => {
      mockServicioUsuarios.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validarUsuario(
        'juan@example.com',
        'Password123!',
      );

      expect(result).not.toHaveProperty('contraseña');
      expect(result?.correo).toBe(mockUsuario.correo);
      expect(result?.rol).toBe(mockUsuario.rol);
    });

    it('debe retornar null si el usuario no existe', async () => {
      mockServicioUsuarios.findByEmail.mockResolvedValue(null);

      const result = await service.validarUsuario(
        'notfound@example.com',
        'Password123!',
      );

      expect(result).toBeNull();
    });

    it('debe retornar null si la contraseña es incorrecta', async () => {
      mockServicioUsuarios.findByEmail.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validarUsuario(
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
