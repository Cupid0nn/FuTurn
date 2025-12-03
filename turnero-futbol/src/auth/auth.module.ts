import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModuloUsuarios } from '../usuarios/usuarios.module';
import { ServicioAutenticacion } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ControladorAutenticacion } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    ModuloUsuarios,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiracion = configService.get<string>('JWT_EXPIRES_IN') || '1h';
        return {
          secret: configService.get<string>('JWT_SECRET') || 'change_me',
          signOptions: { expiresIn: expiracion as any },
        } as any;
      },
    }),
  ],
  providers: [ServicioAutenticacion, JwtStrategy],
  controllers: [ControladorAutenticacion],
  exports: [ServicioAutenticacion],
})
export class ModuloAutenticacion {}
