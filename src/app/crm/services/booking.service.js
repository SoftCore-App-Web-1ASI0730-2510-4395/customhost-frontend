// src/services/booking.service.js
import axios from 'axios';
import Booking from '../model/booking.entity.js';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/booking';
const USERS_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/users';
const ROOMS_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/rooms';

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
        console.log('Datos enviados a createBooking:', bookingData); // Log para depuración
        const response = await axios.post(API_URL, bookingData);
        const data = response.data;
        // Reordena el objeto para que el id esté primero y no se sobrescriba
        const { id, ...rest } = data;
        const ordered = { id, ...rest };
        return new Booking(ordered);
    } catch (error) {
        console.error('Error al crear reserva:', error?.response?.data || error.message);
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
    if (id === null || id === undefined) {
        throw new Error('El id de la reserva no puede ser null o undefined');
    }
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        if (response.status >= 300) {
            // Log detallado para depuración
            console.error('Respuesta inesperada al eliminar:', response.status, response.data);
            throw new Error('No se pudo eliminar la reserva en el backend');
        }
        return true;
    } catch (error) {
        // Log detallado para depuración
        if (error.response) {
            console.error('Error al eliminar reserva:', error.response.status, error.response.data);
        } else {
            console.error('Error al eliminar reserva:', error.message);
        }
        throw error;
    }
};

export const getBookingsWithDetails = async () => {
    try {
        const [bookingsRes, usersRes, roomsRes] = await Promise.all([
            axios.get(API_URL),
            axios.get(USERS_URL),
            axios.get(ROOMS_URL)
        ])

        const bookings = bookingsRes.data.map(b => new Booking(b))
        const users = usersRes.data
        const rooms = roomsRes.data

        return bookings.map(booking => {
            const user = users.find(u => u.id === booking.userId)
            const room = rooms.find(r => r.id === booking.roomId)

            return {
                ...booking,
                user,
                room,
                fullName: user ? `${user.firstName} ${user.lastName}` : 'Desconocido',
                roomNumber: room?.roomNumber || 'N/A'
            }
        })
    } catch (error) {
        console.error('Error al cargar reservas:', error)
        return []
    }
};

/**
 * Obtiene las reservas de un usuario específico
 */
export const getBookingsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data.map(b => new Booking(b));
    } catch (error) {
        console.error(`Error al obtener reservas del usuario ${userId}:`, error);
        return [];
    }
};