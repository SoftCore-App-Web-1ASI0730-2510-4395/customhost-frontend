// src/crm/application/guest.facade.js

import { getBookingsWithDetails } from '../services/booking.service.js';
import { getUserById } from '../../profiles/services/user.service.js';

/**
 * Obtiene las reservas del huésped y le añade el nombre del usuario
 */
export default {
    /**
     * Devuelve todas las reservas con detalles del huésped
     *
     * @param {number} userId - ID del huésped
     * @returns {Promise<Array>} - Array de reservas con información del huésped
     * @throws {Error} - Si ocurre un error al obtener las reservas o el usuario
     */
    async getGuestBookings(userId) {
        try {
            // Obtener reservas y usuario en paralelo
            const [bookings, user] = await Promise.all([
                getBookingsWithDetails(userId),
                getUserById(userId)
            ]);

            // Añadir nombre del huésped a cada reserva
            return bookings.map(booking => ({
                ...booking,
                guestName: user ? `${user.firstName} ${user.lastName}` : 'Desconocido',
            }));

        } catch (error) {
            console.error('Error obteniendo reservas del huésped:', error);
            throw new Error('No se pudieron obtener las reservas del huésped');
        }
    },

    /**
     * Obtiene una reserva específica con info del huésped
     *
     * @param {number} bookingId - ID de la reserva
     * @param {number} userId - ID del huésped
     * @returns {Promise<Object>} - Reserva con información del huésped
     * @throws {Error} - Si la reserva no existe o si el usuario no tiene permisos
     */
    async getGuestBookingById(bookingId, userId) {
        try {
            const booking = await getBookingById(bookingId);
            if (!booking || booking.userId !== userId) {
                throw new Error("Reserva no encontrada o no autorizada");
            }

            const user = await getUserById(userId);

            return {
                ...booking,
                guestName: user ? `${user.firstName} ${user.lastName}` : 'Desconocido'
            };

        } catch (error) {
            console.error('Error obteniendo detalle de reserva:', error);
            throw error;
        }
    }
};