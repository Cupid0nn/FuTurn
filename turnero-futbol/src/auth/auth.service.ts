import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ServicioUsuarios } from '../usuarios/usuarios.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class ServicioAutenticacion {
  constructor(
    private readonly servicioUsuarios: ServicioUsuarios,
    private readonly jwtService: JwtService,
  ) {}

  async register(registroDto: RegisterDto) {
    const existing = await this.servicioUsuarios.findByEmail(
      registroDto.correo,
    );
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hasheada = await bcrypt.hash(registroDto.contraseña, 10);
    const usuario = await this.servicioUsuarios.crear({
      nombre: registroDto.nombre,
      correo: registroDto.correo,
      contraseña: hasheada,
    } as any);

    // no devolver contraseña
    // @ts-expect-error - eliminar propiedad no utilizada
    delete usuario.contraseña;
    return usuario;
  }

  async validarUsuario(correo: string, contrasena: string) {
    const usuario = await this.servicioUsuarios.findByEmail(correo);
    if (!usuario) return null;
    const coincide = await bcrypt.compare(contrasena, usuario.contraseña);
    if (!coincide) return null;

    // @ts-expect-error - eliminar propiedad no utilizada
    delete usuario.contraseña;
    return usuario;
  }

  async iniciarSesion(inicioSesionDto: LoginDto) {
    const usuario = await this.servicioUsuarios.findByEmail(
      inicioSesionDto.correo,
    );
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const coincide = await bcrypt.compare(
      inicioSesionDto.contraseña,
      usuario.contraseña,
    );
    if (!coincide) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    };
    return { token_acceso: this.jwtService.sign(payload) };
  }
}
