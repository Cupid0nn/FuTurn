// User types
export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  rol: 'admin' | 'cliente';
  createdAt: string;
}

export interface UsuarioAutenticado extends Usuario {
  token: string;
}

// Cancha types
export interface Cancha {
  id: string;
  nombre: string;
  descripcion: string;
  precioHora: number;
  disponible: boolean;
  createdAt: string;
}

// Reserva types
export interface Reserva {
  id: string;
  fechaHora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  canchaId: string;
  usuarioId: string;
  usuario?: Usuario;
  cancha?: Cancha;
  createdAt: string;
}

// Slot disponible
export interface SlotDisponible {
  hora: number;
  disponible: boolean;
}

// Producto types
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  disponible: boolean;
  imagenUrl?: string;
  createdAt: string;
}

// Pedido types
export interface ItemPedido {
  id: string;
  cantidad: number;
  precioUnitario: number;
  producto?: Producto;
}

export interface Pedido {
  id: string;
  fechaPedido: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'entregado';
  statusPago: 'sin_pagar' | 'pendiente' | 'pagado' | 'rechazado';
  total: number;
  direccionEntrega: string;
  paymentId?: string;
  usuario?: Usuario;
  productos?: ItemPedido[];
  createdAt: string;
}

// Auth responses
export interface LoginResponse {
  token_acceso: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contraseña: string;
}

export interface LoginRequest {
  correo: string;
  contraseña: string;
}

// Pago types
export interface PreferenciaPropsProducto {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface PreferenciaProps {
  items: PreferenciaPropsProducto[];
  usuario: Usuario;
  pedidoId: string;
}

export interface PagoResponse {
  preferenceId: string;
  paymentUrl: string;
}

// Error response
export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Carrito local
export interface CarritoItem {
  productoId: string;
  producto: Producto;
  cantidad: number;
}

export interface Carrito {
  items: CarritoItem[];
  total: number;
}
