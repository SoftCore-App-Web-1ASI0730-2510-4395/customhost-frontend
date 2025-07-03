// src/crm/services/rooms.service.js

import apiClient from '../../shared/services/api-service.js';
import Room from '../model/rooms.entity';

const API_URL = '/api/v1/rooms';

/**
 * Obtiene todos los cuartos y devuelve instancias del modelo Room
 */
export const getRooms = async () => {
    try {
        const response = await apiClient.get(API_URL);

        // 1) ver qué llega del API


        const rooms = response.data.map(raw => {
            const room = new Room(raw);
            // 2) ver que la entidad Room recibe bien los campos

            return room;
        });

        return rooms;
    } catch (error) {

        return [];
    }
};


/**
 * Obtiene un cuarto específico por ID
 */
export const getRoomById = async (roomId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${roomId}`);
        return new Room(response.data);
    } catch (error) {

        throw error;
    }
};

/**
 * Obtiene los cuartos de un hotel en específico
 */
export const getRoomsByHotelId = async (hotelId) => {
    try {
        const response = await apiClient.get(`${API_URL}?hotelId=${hotelId}`);
        return response.data.map(room => new Room(room));
    } catch (error) {
        console.error('Error al filtrar cuartos por hotel:', error);
        return [];
    }
};

/**
 * Crea una nueva habitación
 */
export const createRoom = async (roomData) => {
    // Eliminar id o roomId si existen
    const { id, roomId, ...data } = roomData;
    const room = new Room(data);
    const response = await apiClient.post(API_URL, room);
    return new Room(response.data);
};

/**
 * Actualiza una habitación existente
 */
export const updateRoom = async (id, roomData) => {
    const response = await apiClient.put(`${API_URL}/${id}`, roomData);
    return new Room(response.data);
};

/**
 * Actualiza solo el status de una habitación existente (PATCH)
 */
export const updateRoomStatus = async (id, status) => {
    const response = await apiClient.patch(`${API_URL}/${id}`, { status });
    return new Room(response.data);
};

/**
 * Elimina una habitación por ID
 */
export const deleteRoom = async (id) => {
    await apiClient.delete(`${API_URL}/${id}`);
};

/**
 * Obtiene varias habitaciones por sus IDs (para uso con db.json/fake backend)
 * @param {Array<number>} ids
 * @returns {Promise<Array>}
 */
export async function getRoomsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    // Usar apiClient en lugar de fetch
    const response = await apiClient.get(API_URL);
    const allRooms = response.data;
    return allRooms.filter(room => ids.includes(room.id));
}