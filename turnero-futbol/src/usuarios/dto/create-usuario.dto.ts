export class CreateUsuarioDto {
  nombre: string;
  correo: string;
  contraseña: string;
  rol?: 'admin' | 'cliente';
  telefono?: string;
  direccion?: string;
}
