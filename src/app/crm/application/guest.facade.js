// src/crm/application/guest.facade.js

import { getBookings, getBookingById } from '../services/booking.service.js';
import { getUserById } from '../../profiles/services/user.service.js';
import { getServiceRequests, createServiceRequest } from '../services/service-request.service.js';

/**
 * Coordina información entre contextos para mostrar reservas con detalles del huésped
 */
export default {
    /**
     * Devuelve todas las reservas con información del huésped
     *
     * @param {number} userId - ID del huésped
     * @returns {Promise<Array>} - Array de reservas con nombre del huésped
     * @throws {Error} - Si hay fallos al obtener los datos
     */
    async getGuestBookings(userId) {
        try {
            // Obtener reservas y usuario en paralelo
            const [bookings, user] = await Promise.all([
                getBookings(),
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
     * @throws {Error} - Si la reserva no existe o el usuario no tiene permiso
     */
    async getGuestBookingById(bookingId, userId) {
        try {
            const booking = await getBookingById(bookingId);

            if (!booking || booking.userId !== userId) {
                // noinspection ExceptionCaughtLocallyJS
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
    },

    /**
     * Obtiene todas las solicitudes del huésped
     */
    async getGuestServiceRequests(userId) {
        try {
            const requests = await getServiceRequests();
            const user = await getUserById(userId);

            return requests
                .filter(r => r.userId === userId)
                .map(r => ({
                    ...r,
                    guestName: user ? `${user.firstName} ${user.lastName}` : 'Desconocido'
                }));
        } catch (error) {
            console.error('Error obteniendo solicitudes:', error);
            return [];
        }
    },

    /**
     * Crea una nueva solicitud de servicio
     */
    async submitServiceRequest(requestData) {
        try {
            return await createServiceRequest(requestData);
        } catch (error) {
            console.error('Error enviando solicitud:', error);
            throw error;
        }
    }


};