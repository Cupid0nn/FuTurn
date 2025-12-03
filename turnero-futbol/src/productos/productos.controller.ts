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
import { ServicioProductos } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Controller('productos')
export class ControladorProductos {
  constructor(private readonly servicioProductos: ServicioProductos) {}

  @Post()
  crear(@Body() crearProductoDto: CreateProductoDto) {
    return this.servicioProductos.crear(crearProductoDto);
  }

  @Get()
  obtenerTodos() {
    return this.servicioProductos.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioProductos.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.servicioProductos.actualizar(id, updateProductoDto);
  }

  @Delete(':id')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioProductos.eliminar(id);
  }
}
