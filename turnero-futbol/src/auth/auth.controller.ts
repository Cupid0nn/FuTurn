import { Controller, Post, Body } from '@nestjs/common';
import { ServicioAutenticacion } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('autenticacion')
export class ControladorAutenticacion {
  constructor(private readonly servicioAuth: ServicioAutenticacion) {}

  @Post('registro')
  registro(@Body() registroDto: RegisterDto) {
    return this.servicioAuth.register(registroDto);
  }

  @Post('iniciar-sesion')
  iniciarSesion(@Body() inicioSesionDto: LoginDto) {
    return this.servicioAuth.iniciarSesion(inicioSesionDto);
  }
}
