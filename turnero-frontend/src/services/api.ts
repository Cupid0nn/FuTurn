import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { 
  mockLogin, 
  mockRegister, 
  mockCanchas, 
  mockProductos, 
  mockReservas,
  simulateApiCall 
} from './mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true; // Usar mock por defecto

let apiClient: AxiosInstance;

export const initializeApi = () => {
  apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para agregar token a cada request
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar errores de respuesta
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Si es 401, limpiar token y redirigir a login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        const auth = useAuthStore.getState();
        auth.logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const getApiClient = (): AxiosInstance => {
  if (!apiClient) {
    initializeApi();
  }
  return apiClient;
};

// Servicios de autenticación
export const authService = {
  register: async (nombre: string, correo: string, contraseña: string) => {
    if (USE_MOCK) {
      return mockRegister(nombre, correo, contraseña);
    }
    const response = await getApiClient().post('/autenticacion/registro', {
      nombre,
      correo,
      contraseña,
    });
    return response.data;
  },

  login: async (correo: string, contraseña: string) => {
    if (USE_MOCK) {
      return mockLogin(correo, contraseña);
    }
    const response = await getApiClient().post('/autenticacion/iniciar-sesion', {
      correo,
      contraseña,
    });
    return response.data;
  },
};

// Servicios de usuarios
export const usuariosService = {
  getAll: async () => {
    const response = await getApiClient().get('/usuarios');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await getApiClient().get(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await getApiClient().post('/usuarios', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await getApiClient().patch(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await getApiClient().delete(`/usuarios/${id}`);
    return response.data;
  },
};

// Servicios de canchas
export const canchasService = {
  getAll: async () => {
    if (USE_MOCK) {
      await simulateApiCall(800);
      return mockCanchas;
    }
    const response = await getApiClient().get('/canchas');
    return response.data;
  },

  getById: async (id: string) => {
    if (USE_MOCK) {
      await simulateApiCall(500);
      return mockCanchas.find(c => c.id === id);
    }
    const response = await getApiClient().get(`/canchas/${id}`);
    return response.data;
  },

  getDisponibilidad: async (canchaId: string, fecha: string) => {
    if (USE_MOCK) {
      await simulateApiCall(600);
      // Retornar slots disponibles de 8 a 22
      return Array.from({ length: 14 }, (_, i) => ({
        hora: 8 + i,
        disponible: Math.random() > 0.3,
      }));
    }
    const response = await getApiClient().get(
      `/reservas/disponibilidad/${canchaId}/${fecha}`
    );
    return response.data;
  },

  create: async (data: any) => {
    const response = await getApiClient().post('/canchas', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await getApiClient().patch(`/canchas/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await getApiClient().delete(`/canchas/${id}`);
    return response.data;
  },
};

// Servicios de reservas
export const reservasService = {
  getAll: async () => {
    if (USE_MOCK) {
      await simulateApiCall(700);
      return mockReservas;
    }
    const response = await getApiClient().get('/reservas');
    return response.data;
  },

  getById: async (id: string) => {
    if (USE_MOCK) {
      await simulateApiCall(500);
      return mockReservas.find(r => r.id === id);
    }
    const response = await getApiClient().get(`/reservas/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    if (USE_MOCK) {
      await simulateApiCall(1000);
      return { id: Math.random().toString(), ...data, estado: 'confirmada' };
    }
    const response = await getApiClient().post('/reservas', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await getApiClient().patch(`/reservas/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await getApiClient().delete(`/reservas/${id}`);
    return response.data;
  },
};

// Servicios de productos
export const productosService = {
  getAll: async () => {
    if (USE_MOCK) {
      await simulateApiCall(800);
      return mockProductos;
    }
    const response = await getApiClient().get('/productos');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await getApiClient().get(`/productos/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await getApiClient().post('/productos', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await getApiClient().patch(`/productos/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await getApiClient().delete(`/productos/${id}`);
    return response.data;
  },
};

// Servicios de pedidos
export const pedidosService = {
  getAll: async () => {
    const response = await getApiClient().get('/pedidos');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await getApiClient().get(`/pedidos/${id}`);
    return response.data;
  },

  getByUsuario: async (usuarioId: string) => {
    const response = await getApiClient().get(`/pedidos/usuario/${usuarioId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await getApiClient().post('/pedidos', data);
    return response.data;
  },

  addProducto: async (pedidoId: string, productoId: string, cantidad: number) => {
    const response = await getApiClient().post(
      `/pedidos/${pedidoId}/productos`,
      { productoId, cantidad }
    );
    return response.data;
  },

  removeProducto: async (pedidoId: string, productoId: string) => {
    const response = await getApiClient().delete(
      `/pedidos/${pedidoId}/productos/${productoId}`
    );
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await getApiClient().patch(`/pedidos/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await getApiClient().delete(`/pedidos/${id}`);
    return response.data;
  },

  confirmarPago: async (id: string) => {
    const response = await getApiClient().post(`/pedidos/${id}/confirmar-pago`);
    return response.data;
  },
};

// Servicios de pagos
export const pagosService = {
  crearPreferencia: async (data: any) => {
    const response = await getApiClient().post('/pagos/crear-preferencia', data);
    return response.data;
  },

  obtener: async (paymentId: string) => {
    const response = await getApiClient().get(`/pagos/obtener/${paymentId}`);
    return response.data;
  },
};
