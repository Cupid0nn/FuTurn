import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ServicioReservas } from './reservas.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Reservas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas')
export class ControladorReservas {
  constructor(private readonly servicioReservas: ServicioReservas) {}

  @Post()
  @Roles('cliente', 'admin')
  crear(@Body() crearReservaDto: CreateReservaDto) {
    return this.servicioReservas.crear(crearReservaDto);
  }

  @Get()
  @Roles('admin')
  obtenerTodas() {
    return this.servicioReservas.obtenerTodas();
  }

  @Get(':id')
  @Roles('admin')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioReservas.obtenerPorId(id);
  }

  @Patch(':id')
  @Roles('admin')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return this.servicioReservas.actualizar(id, updateReservaDto);
  }

  @Delete(':id')
  @Roles('admin')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioReservas.eliminar(id);
  }
}
