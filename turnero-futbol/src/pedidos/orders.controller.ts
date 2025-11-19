import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreatePedidoDto,
  UpdatePedidoDto,
  AddProductoToPedidoDto,
} from './dto/pedido.dto';

@Controller('pedidos')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  crear(@Body() crearPedidoDto: CreatePedidoDto) {
    return this.ordersService.crear(crearPedidoDto);
  }

  @Get()
  obtenerTodos() {
    return this.ordersService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.obtenerPorId(id);
  }

  @Get('usuario/:usuarioId')
  obtenerPorUsuario(
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
  ) {
    return this.ordersService.obtenerPorUsuario(usuarioId);
  }

  @Patch(':id')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.ordersService.actualizar(id, updatePedidoDto);
  }

  @Delete(':id')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.eliminar(id);
  }

  @Post(':id/productos')
  agregarProducto(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() agregarProductoDto: AddProductoToPedidoDto,
  ) {
    return this.ordersService.agregarProducto(id, agregarProductoDto);
  }

  @Delete(':id/productos/:productoId')
  removerProducto(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('productoId', new ParseUUIDPipe()) productoId: string,
  ) {
    return this.ordersService.removerProducto(id, productoId);
  }
}
