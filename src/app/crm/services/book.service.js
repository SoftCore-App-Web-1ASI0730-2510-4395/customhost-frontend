// src/services/booking.service.js
import { Booking } from '../model/book.entity';

const API_URL = 'http://localhost:3001/bookings'; // Asegúrate de tener corriendo el json-server

export default {
    /**
     * Obtiene todas las reservas
     */
    async getAll() {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.map(item => new Booking(item));
    },

    /**
     * Obtiene una reserva por ID
     * @param {string|number} id - ID de la reserva
     */
    async getById(id) {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        return new Booking(data);
    },

    /**
     * Crea una nueva reserva
     * @param {Object} bookingData - Datos de la nueva reserva
     */
    async create(bookingData) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        return new Booking(data);
    },

    /**
     * Actualiza una reserva existente
     * @param {string|number} id - ID de la reserva a actualizar
     * @param {Object} bookingData - Nuevos datos de la reserva
     */
    async update(id, bookingData) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        return new Booking(data);
    },

    /**
     * Elimina una reserva por su ID
     * @param {string|number} id - ID de la reserva a eliminar
     */
    async deleteById(id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        return id;
    }
};