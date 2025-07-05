import apiClient from '../../shared/services/api-service.js';

class AuthService {
  /**
   * Iniciar sesión
   * @param {Object} credentials - Las credenciales de login
   * @param {string} credentials.username - El nombre de usuario
   * @param {string} credentials.password - La contraseña
   * @returns {Promise<Object>} Los datos del usuario autenticado
   */
  async signIn(credentials) {
    try {
      const response = await apiClient.post('/api/v1/authentication/sign-in', {
        username: credentials.username,
        password: credentials.password
      });
      
      // Guardar datos del usuario en localStorage
      if (response.data) {
        localStorage.setItem('userData', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Registrar usuario común (rol GUEST)
   * @param {Object} userData - Los datos del usuario
   * @param {string} userData.username - El nombre de usuario
   * @param {string} userData.password - La contraseña
   * @returns {Promise<Object>} Confirmación del registro
   */
  async signUpUser(userData) {
    try {
      const response = await apiClient.post('/api/v1/authentication/sign-up', {
        username: userData.username,
        password: userData.password,
        role: 'GUEST'
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  /**
   * Registrar hotel (rol ADMIN)
   * @param {Object} hotelData - Los datos del hotel
   * @param {string} hotelData.username - El nombre de usuario del hotel
   * @param {string} hotelData.password - La contraseña
   * @returns {Promise<Object>} Confirmación del registro
   */
  async signUpHotel(hotelData) {
    try {
      const response = await apiClient.post('/api/v1/authentication/sign-up', {
        username: hotelData.username,
        password: hotelData.password,
        role: 'ADMIN'
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar hotel');
    }
  }

  /**
   * Cerrar sesión
   */
  signOut() {
    localStorage.removeItem('userData');
  }

  /**
   * Obtener usuario actual
   * @returns {Object|null} Los datos del usuario o null si no está autenticado
   */
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} True si está autenticado
   */
  isAuthenticated() {
    const userData = this.getCurrentUser();
    return userData && userData.token;
  }

  /**
   * Obtener el rol del usuario actual
   * @returns {string|null} El rol del usuario o null
   */
  getCurrentUserRole() {
    const userData = this.getCurrentUser();
    return userData ? userData.role : null;
  }
}

export default new AuthService();
