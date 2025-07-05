// src/app/profiles/services/user.service.js

import apiClient from '../../shared/services/api-service.js';
import User from '../model/user.entity.js';

const API_URL = '/api/v1/users';

/**
 * Obtiene un usuario por ID y devuelve una instancia del modelo User
 */
export const getUserById = async (userId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${userId}`);
        return new User(response.data);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
};
