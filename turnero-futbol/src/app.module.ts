import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CanchasModule } from './canchas/canchas.module';
import { ReservasModule } from './reservas/reservas.module';
import { ProductosModule } from './productos/productos.module';
import { OrdersModule } from './pedidos/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: '',
      autoLoadEntities: true,   // detecta automáticamente las entidades
      synchronize: true,       // sincroniza las tablas con las entidades
       dropSchema: true       // crea las tablas en dev (⚠️ en prod se desactiva)
    }),
    UsuariosModule,
    CanchasModule,
    ReservasModule,
    ProductosModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule {}
