// src/crm/services/rooms.service.js

import axios from 'axios';
import Room from '../model/rooms.entity';
import Rooms from "../model/rooms.entity.js";

const API_URL = 'http://localhost:3001/rooms';

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

export const createRoom = async (roomData) => {
    const room = new Rooms(roomData)
    const response = await axios.post(API_URL, room)
    return new Rooms(response.data)
}

export const updateRoom = async (id, roomData) => {
    const response = await axios.put(`${API_URL}/${id}`, roomData)
    return new Rooms(response.data)
}

export const deleteRoom = async (id) => {
    await axios.delete(`${API_URL}/${id}`)
}

export class room {
}