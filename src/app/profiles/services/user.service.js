// src/app/profiles/services/user.service.js

import axios from 'axios';
import User from '../model/user.entity.js';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/users';

/**
 * Obtiene un usuario por ID y devuelve una instancia del modelo User
 */
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return new User(response.data);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
};
