import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CanchasService } from './canchas.service';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';

@Controller('canchas')
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}

  @Post()
  crear(@Body() crearCanchaDto: CreateCanchaDto) {
    return this.canchasService.crear(crearCanchaDto);
  }

  @Get()
  obtenerTodas() {
    return this.canchasService.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.canchasService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCanchaDto: UpdateCanchaDto,
  ) {
    return this.canchasService.actualizar(id, updateCanchaDto);
  }

  @Delete(':id')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.canchasService.eliminar(id);
  }
}
