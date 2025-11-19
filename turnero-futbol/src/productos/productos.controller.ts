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
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  crear(@Body() crearProductoDto: CreateProductoDto) {
    return this.productosService.crear(crearProductoDto);
  }

  @Get()
  obtenerTodos() {
    return this.productosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productosService.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.actualizar(id, updateProductoDto);
  }

  @Delete(':id')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productosService.eliminar(id);
  }
}
