// Mock data service para desarrollo sin backend
import { 
  Usuario, 
  Cancha, 
  Reserva, 
  Producto, 
  Pedido,
  LoginResponse 
} from '@/types';

// Mock usuarios
export const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    telefono: '+541234567890',
    direccion: 'Av. Test 123',
    rol: 'cliente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Admin FuTurn',
    correo: 'admin@futurn.com',
    telefono: '+541234567891',
    direccion: 'Calle Admin 456',
    rol: 'admin',
    createdAt: new Date().toISOString(),
  },
];

// Mock canchas
export const mockCanchas: Cancha[] = [
  {
    id: '1',
    nombre: 'Cancha 5 - Centro',
    descripcion: 'Cancha de fútbol 5 en el centro',
    precioHora: 500,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Cancha 11 - Barrio',
    descripcion: 'Cancha de fútbol 11 en el barrio',
    precioHora: 800,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    nombre: 'Cancha 5 - Zona Norte',
    descripcion: 'Cancha de fútbol 5 en zona norte',
    precioHora: 450,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
];

// Mock productos
export const mockProductos: Producto[] = [
  {
    id: '1',
    nombre: 'Cerveza Quilmes 1L',
    descripcion: 'Cerveza premium 1 litro',
    precio: 150,
    stock: 50,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Agua Mineral 500ml',
    descripcion: 'Agua mineral natural',
    precio: 50,
    stock: 100,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    nombre: 'Refresco Cola 2L',
    descripcion: 'Refresco cola 2 litros',
    precio: 80,
    stock: 75,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    nombre: 'Energizante Red Bull',
    descripcion: 'Bebida energética 250ml',
    precio: 120,
    stock: 40,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    nombre: 'Jugo Natural Naranja',
    descripcion: 'Jugo de naranja fresco 1L',
    precio: 90,
    stock: 60,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    nombre: 'Gatorade 500ml',
    descripcion: 'Bebida deportiva 500ml',
    precio: 100,
    stock: 45,
    disponible: true,
    createdAt: new Date().toISOString(),
  },
];

// Mock reservas
export const mockReservas: Reserva[] = [
  {
    id: '1',
    fechaHora: new Date(Date.now() + 86400000).toISOString(), // Mañana
    estado: 'confirmada',
    canchaId: '1',
    usuarioId: '1',
    cancha: mockCanchas[0],
    usuario: mockUsuarios[0],
    createdAt: new Date().toISOString(),
  },
];

// Simulador de respuestas HTTP
export const simulateApiCall = async <T>(delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({} as T);
    }, delay);
  });
};

// Login simulado
export const mockLogin = async (
  correo: string,
  contraseña: string
): Promise<LoginResponse> => {
  await simulateApiCall(1000);
  
  // Buscar usuario en mock data
  const usuario = mockUsuarios.find(u => u.correo === correo);
  
  if (!usuario) {
    throw {
      response: {
        status: 401,
        data: { message: 'Credenciales inválidas' },
      },
    };
  }
  
  // Verificar contraseña
  if (
    (correo === 'juan@example.com' && contraseña === 'password123') ||
    (correo === 'admin@futurn.com' && contraseña === 'admin123456')
  ) {
    return {
      token_acceso: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
    };
  }
  
  throw {
    response: {
      status: 401,
      data: { message: 'Credenciales inválidas' },
    },
  };
};

// Registro simulado
export const mockRegister = async (
  nombre: string,
  correo: string,
  contraseña: string
): Promise<void> => {
  await simulateApiCall(1500);
  
  if (correo.includes('@example.com') && contraseña.length >= 6) {
    return;
  }
  
  throw {
    response: {
      status: 400,
      data: { message: ['Correo o contraseña inválidos'] },
    },
  };
};
