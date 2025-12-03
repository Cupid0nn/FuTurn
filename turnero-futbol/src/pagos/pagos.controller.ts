import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Redirect,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/pago.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('crear-preferencia')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear preferencia de pago en Mercado Libre',
    description:
      'Crea una preferencia de pago y retorna el URL donde el usuario debe ir a pagar',
  })
  async crearPreferencia(@Body() crearPagoDto: CreatePagoDto) {
    return this.pagosService.crearPreferencia(crearPagoDto);
  }

  @Get('obtener/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener estado de un pago',
    description: 'Obtiene la información y estado actual de un pago',
  })
  async obtenerPago(@Param('paymentId') paymentId: string) {
    return this.pagosService.obtenerPago(paymentId);
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Webhook de Mercado Libre',
    description:
      'Recibe notificaciones de cambios en pagos desde Mercado Libre',
  })
  async webhook(@Query() query: any) {
    // Mercado Libre envía topic e id como query parameters
    const { topic, id } = query;
    return this.pagosService.procesarWebhook(topic, id);
  }

  @Get('success')
  @Redirect()
  @ApiOperation({
    summary: 'Redirección de pago exitoso',
    description: 'Usuario es redirigido aquí después de pago exitoso',
  })
  success() {
    // En producción, redirigir a frontend con información del pago
    return { url: process.env.FRONTEND_URL + '/payment-success' };
  }

  @Get('failure')
  @Redirect()
  @ApiOperation({
    summary: 'Redirección de pago fallido',
    description: 'Usuario es redirigido aquí si el pago falla',
  })
  failure() {
    return { url: process.env.FRONTEND_URL + '/payment-failure' };
  }

  @Get('pending')
  @Redirect()
  @ApiOperation({
    summary: 'Redirección de pago pendiente',
    description: 'Usuario es redirigido aquí si el pago está pendiente',
  })
  pending() {
    return { url: process.env.FRONTEND_URL + '/payment-pending' };
  }
}
