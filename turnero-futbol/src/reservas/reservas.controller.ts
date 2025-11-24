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
import { ReservasService } from './reservas.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Reservas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @Roles('cliente', 'admin')
  crear(@Body() crearReservaDto: CreateReservaDto) {
    return this.reservasService.crear(crearReservaDto);
  }

  @Get()
  @Roles('admin')
  obtenerTodas() {
    return this.reservasService.obtenerTodas();
  }

  @Get(':id')
  @Roles('admin')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservasService.obtenerPorId(id);
  }

  @Patch(':id')
  @Roles('admin')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return this.reservasService.actualizar(id, updateReservaDto);
  }

  @Delete(':id')
  @Roles('admin')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reservasService.eliminar(id);
  }
}
