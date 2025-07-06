import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las requests si existe
apiClient.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('userData');
    console.log('[api-service] userData en localStorage:', userData);
    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log('[api-service] parsedData:', parsedData);
      if (parsedData.token) {
        config.headers.Authorization = `Bearer ${parsedData.token}`;
        console.log('[api-service] Token agregado al header:', parsedData.token);
      } else {
        console.warn('[api-service] No se encontró token en userData');
      }
    } else {
      console.warn('[api-service] No hay userData en localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('userData');
      window.location.href = '/iam/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
