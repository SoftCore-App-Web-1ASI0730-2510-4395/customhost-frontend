// src/crm/services/notification.service.js

import apiClient from '../../shared/services/api-service.js';
import Notification from '../model/notification.entity';

const API_URL = '/api/v1/notifications';

/**
 * Obtiene todas las notificaciones de un usuario
 */
export const getNotificationsByUserId = async (userId) => {
    try {
        const response = await apiClient.get(`${API_URL}?userId=${userId}`);
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
        const response = await apiClient.patch(`${API_URL}/${id}`, { read: true });
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
        const response = await apiClient.post(API_URL, data);
        return new Notification(response.data);
    } catch (error) {
        console.error('Error al crear notificación:', error);
        throw error;
    }
};