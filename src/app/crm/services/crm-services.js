import axios from 'axios';
import Room from 'src/app/crm/model/rooms.entity.js';

// URL base de la API
const API_URL = 'http://localhost:3001/rooms'; // Cambia esta URL por la de tu API

// Obtener las habitaciones
export const getRooms = async () => {
    try {
        const response = await axios.get(API_URL);
        // Convertir los datos en instancias de Room
        return response.data.map(room => new Room(room));
    } catch (error) {
        throw new Error('Error al obtener las habitaciones');
    }
};

// Crear una nueva habitación
export const createRoom = async (roomData) => {
    try {
        const room = new Room(roomData); // Convertir los datos a una instancia de Room
        const response = await axios.post(API_URL, room);
        return new Room(response.data); // Devolver la habitación creada
    } catch (error) {
        throw new Error('Error al crear la habitación');
    }
};

// Actualizar una habitación existente
export const updateRoom = async (id, roomData) => {
    try {
        const room = new Room(roomData); // Convertir los datos a una instancia de Room
        const response = await axios.put(`${API_URL}/${id}`, room);
        return new Room(response.data); // Devolver la habitación actualizada
    } catch (error) {
        throw new Error('Error al actualizar la habitación');
    }
};

// Eliminar una habitación
export const deleteRoom = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw new Error('Error al eliminar la habitación');
    }
};
