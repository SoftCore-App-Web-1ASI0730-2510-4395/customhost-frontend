// src/crm/services/notification.service.js

import axios from 'axios';
import Notification from '../model/notification.entity';

const API_URL = 'http://localhost:3001/notifications';

/**
 * Obtiene todas las notificaciones de un usuario
 */
export const getNotificationsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}?userId=${userId}`);
        return response.data.map(n => new Notification(n));
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        return [];
    }
};

/**
 * Marca una notificación como leída
 */
export const markNotificationAsRead = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, { read: true });
        return new Notification(response.data);
    } catch (error) {
        console.error('Error al marcar como leída:', error);
        throw error;
    }
};

/**
 * Crea una nueva notificación (solo staff)
 */
export const createNotification = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return new Notification(response.data);
    } catch (error) {
        console.error('Error al crear notificación:', error);
        throw error;
    }
};