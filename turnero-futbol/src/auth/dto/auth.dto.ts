import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @IsEmail()
  @ApiProperty({ example: 'juan@ejemplo.com' })
  correo: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'contraseña123' })
  contraseña: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'juan@ejemplo.com' })
  correo: string;

  @IsString()
  @ApiProperty({ example: 'contraseña123' })
  contraseña: string;
}
