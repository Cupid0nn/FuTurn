import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usuariosService.findByEmail(registerDto.correo);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashed = await bcrypt.hash(registerDto.contraseña, 10);
    const user = await this.usuariosService.crear({
      nombre: registerDto.nombre,
      correo: registerDto.correo,
      contraseña: hashed,
    } as any);

    // no devolver contraseña
    // @ts-expect-error - delete unused property
    delete user.contraseña;
    return user;
  }

  async validateUser(correo: string, pass: string) {
    const user = await this.usuariosService.findByEmail(correo);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.contraseña);
    if (!match) return null;

    // @ts-expect-error - delete unused property
    delete user.contraseña;
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usuariosService.findByEmail(loginDto.correo);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(loginDto.contraseña, user.contraseña);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, correo: user.correo, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }
}
