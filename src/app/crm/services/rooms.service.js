// src/crm/services/rooms.service.js

import axios from 'axios';
import Room from '../model/rooms.entity';

const API_URL = 'http://localhost:3001/api/v1/rooms';

/**
 * Obtiene todos los cuartos y devuelve instancias del modelo Room
 */
export const getRooms = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.map(room => new Room(room));
    } catch (error) {
        console.error('Error al obtener cuartos:', error);
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
        console.error('Error al obtener cuarto por ID:', error);
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
 * Elimina una habitación por ID
 */
export const deleteRoom = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};