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
import { ServicioPedidos } from './orders.service';
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
export class ControladorPedidos {
  constructor(private readonly servicioPedidos: ServicioPedidos) {}

  @Post()
  @Roles('cliente', 'admin')
  crear(@Body() crearPedidoDto: CreatePedidoDto) {
    return this.servicioPedidos.crear(crearPedidoDto);
  }

  @Get()
  @Roles('admin')
  obtenerTodos() {
    return this.servicioPedidos.obtenerTodos();
  }

  @Get(':id')
  @Roles('admin')
  obtenerPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioPedidos.obtenerPorId(id);
  }

  @Get('usuario/:usuarioId')
  obtenerPorUsuario(
    @Param('usuarioId', new ParseUUIDPipe()) usuarioId: string,
  ) {
    return this.servicioPedidos.obtenerPorUsuario(usuarioId);
  }

  @Patch(':id')
  @Roles('admin')
  actualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() actualizarPedidoDto: UpdatePedidoDto,
  ) {
    return this.servicioPedidos.actualizar(id, actualizarPedidoDto);
  }

  @Delete(':id')
  @Roles('admin')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicioPedidos.eliminar(id);
  }

  @Post(':id/productos')
  agregarProducto(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() agregarProductoDto: AddProductoToPedidoDto,
  ) {
    return this.servicioPedidos.agregarProducto(id, agregarProductoDto);
  }

  @Delete(':id/productos/:productoId')
  removerProducto(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('productoId', new ParseUUIDPipe()) productoId: string,
  ) {
    return this.servicioPedidos.removerProducto(id, productoId);
  }

  @Post(':id/confirmar-pago')
  @Roles('cliente', 'admin')
  confirmarPago(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() cuerpo: { idPago: string },
  ) {
    return this.servicioPedidos.confirmarPago(id, cuerpo.idPago);
  }
}
