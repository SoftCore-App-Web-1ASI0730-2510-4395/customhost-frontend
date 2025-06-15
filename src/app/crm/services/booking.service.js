// src/services/booking.service.js
import axios from 'axios';
import Booking from '../model/booking.entity';

const API_URL = 'http://localhost:3000/bookings';

/**
 * Obtiene todas las reservas y las instancias con el modelo Booking
 */
export const getBookings = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.map(b => new Booking(b));
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        return [];
    }
};

/**
 * Obtiene una reserva por ID
 */
export const getBookingById = async (bookingId) => {
    try {
        const response = await axios.get(`${API_URL}/${bookingId}`);
        return new Booking(response.data);
    } catch (error) {
        console.error('Error al obtener reserva por ID:', error);
        throw error;
    }
};

/**
 * Crea una nueva reserva
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(API_URL, bookingData);
        return new Booking(response.data);
    } catch (error) {
        console.error('Error al crear reserva:', error);
        throw error;
    }
};

/**
 * Actualiza una reserva existente
 */
export const updateBooking = async (id, bookingData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, bookingData);
        return new Booking(response.data);
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        throw error;
    }
};

/**
 * Elimina una reserva por ID
 */
export const deleteBooking = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        throw error;
    }
};

