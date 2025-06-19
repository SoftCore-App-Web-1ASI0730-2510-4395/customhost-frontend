// src/profiles/services/user-preference.service.js

import axios from 'axios';
import UserDevicePreference from '../model/user-device-preference.entity.js';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/user-device-preferences';

/**
 * Guarda una preferencia del usuario para un dispositivo
 */
export const saveUserDevicePreference = async (preference) => {
    try {
        let response;
        if (preference.id) {
            // Actualizar existente
            response = await axios.put(`${API_URL}/${preference.id}`, preference);
        } else {
            // Crear nueva preferencia
            response = await axios.post(API_URL, preference);
        }
        return new UserDevicePreference(response.data);
    } catch (error) {
        console.error('Error al guardar preferencia:', error);
        throw error;
    }
};

/**
 * Obtiene todas las preferencias del usuario
 */
export const getUserDevicePreferences = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}?userId=${userId}`);
        return response.data.map(pref => new UserDevicePreference(pref));
    } catch (error) {
        console.error('Error al obtener preferencias del usuario:', error);
        return [];
    }
};