import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Servicio para manejar transacciones en base de datos
 * Garantiza consistencia en operaciones multi-paso (ACID)
 */
@Injectable()
export class ServicioTransacciones {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Ejecuta una operación dentro de una transacción
   * Si algo falla, toda la transacción se revierte
   */
  async ejecutar<T>(
    callback: (queryRunner: any) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resultado = await callback(queryRunner);
      await queryRunner.commitTransaction();
      return resultado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Ejemplo: Crear pedido + descontar stock (transacción)
   */
  async crearPedidoConProductos(
    queryRunner: any,
    pedidoData: any,
    productos: { productoId: string; cantidad: number }[],
  ) {
    // Insertar pedido
    const pedido = await queryRunner.manager.save('pedido', pedidoData);

    // Descontar stock de cada producto
    for (const { productoId, cantidad } of productos) {
      const producto = await queryRunner.manager.findOne('producto', {
        where: { id: productoId },
      });

      if (!producto || producto.stock < cantidad) {
        throw new Error('Stock insuficiente');
      }

      await queryRunner.manager.update(
        'producto',
        { id: productoId },
        { stock: producto.stock - cantidad },
      );
    }

    return pedido;
  }

  /**
   * Ejemplo: Confirmar pago + actualizar estado pedido
   */
  async confirmarPagoTransaccion(
    queryRunner: any,
    pedidoId: string,
    paymentId: string,
    estado: string,
  ) {
    // Actualizar estado del pedido
    await queryRunner.manager.update(
      'pedido',
      { id: pedidoId },
      {
        statusPago: estado,
        paymentId,
        estado: estado === 'pagado' ? 'confirmado' : 'pendiente',
      },
    );

    // Si el pago fue rechazado, devolver stock
    if (estado === 'rechazado') {
      const pedido = await queryRunner.manager.findOne('pedido', {
        where: { id: pedidoId },
        relations: ['productos'],
      });

      for (const pedidoProducto of pedido.productos) {
        const producto = await queryRunner.manager.findOne('producto', {
          where: { id: pedidoProducto.productoId },
        });

        await queryRunner.manager.update(
          'producto',
          { id: pedidoProducto.productoId },
          { stock: producto.stock + pedidoProducto.cantidad },
        );
      }
    }
  }
}
