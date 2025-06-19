// src/crm/services/rooms.service.js

import axios from 'axios';
import Room from '../model/rooms.entity';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/rooms';

/**
 * Obtiene todos los cuartos y devuelve instancias del modelo Room
 */
export const getRooms = async () => {
    try {
        const response = await axios.get(API_URL);

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
        const response = await axios.get(`${API_URL}/${roomId}`);
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
        const response = await axios.get(`${API_URL}?hotelId=${hotelId}`);
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
    const room = new Room(roomData);
    const response = await axios.post(API_URL, room);
    return new Room(response.data);
};

/**
 * Actualiza una habitación existente
 */
export const updateRoom = async (id, roomData) => {
    const response = await axios.put(`${API_URL}/${id}`, roomData);
    return new Room(response.data);
};

/**
 * Actualiza solo el status de una habitación existente (PATCH)
 */
export const updateRoomStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/${id}`, { status });
    return new Room(response.data);
};

/**
 * Elimina una habitación por ID
 */
export const deleteRoom = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

/**
 * Obtiene varias habitaciones por sus IDs (para uso con db.json/fake backend)
 * @param {Array<number>} ids
 * @returns {Promise<Array>}
 */
export async function getRoomsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    // Usamos fetch porque axios apunta a /api/v1/rooms y aquí necesitamos el mock server
    const res = await fetch('http://localhost:3001/rooms');
    const allRooms = await res.json();
    return allRooms.filter(room => ids.includes(room.id));
}