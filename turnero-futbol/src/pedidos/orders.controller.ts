import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreatePedidoDto,
  UpdatePedidoDto,
  AddProductoToPedidoDto,
} from './dto/pedido.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Pedidos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pedidos')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('cliente', 'admin')
  crear(@Body() crearPedidoDto: CreatePedidoDto) {
    return this.ordersService.crear(crearPedidoDto);
  }

  @Get()
  @Roles('admin')
  obtenerTodos() {
    return this.ordersService.obtenerTodos();
  }

  @Get(':id')
  @Roles('admin')
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
  @Roles('admin')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.ordersService.actualizar(id, updatePedidoDto);
  }

  @Delete(':id')
  @Roles('admin')
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
