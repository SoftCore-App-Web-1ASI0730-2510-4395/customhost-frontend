import apiClient from '../../shared/services/api-service.js';
import Profile from '../model/profile.entity.js';

const API_URL = '/api/v1/profiles';

export const getProfilesByEmail = async (email) => {
  const response = await apiClient.get(`${API_URL}/email/${email}`);
  if (Array.isArray(response.data)) {
    return response.data.map(p => new Profile(p));
  }
  return response.data ? [new Profile(response.data)] : [];
};

export const getProfilesByUserId = async (userId) => {
  const response = await apiClient.get(`${API_URL}/${userId}`);
  return response.data ? new Profile(response.data) : null;
};

/**
 * Crea un nuevo perfil de usuario asociado a un hotel
 * @param {Object} profileData - { hotelId, firstName, lastName, email, phone, password, Role }
 * @returns {Promise<Object>} Perfil creado
 */
export const createProfile = async (profileData) => {
    try {
        // Si profileData.password no existe, no lo envíes
        const dataToSend = { ...profileData };
        if (!profileData.password) {
            delete dataToSend.password;
        }
        const response = await apiClient.post(API_URL, dataToSend);
        return response.data;
    } catch (error) {
        console.error('Error al crear perfil:', error);
        throw error;
    }
};
