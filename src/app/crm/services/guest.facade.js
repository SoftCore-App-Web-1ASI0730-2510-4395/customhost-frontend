// src/crm/application/guest.facade.js

import {getBookings, getBookingsByUserId, getBookingById, deleteBooking} from './booking.service.js';
import { getUserById } from '../../profiles/services/user.service.js';
import { getNotificationsByUserId } from './notification.service.js';
import { getCustomerRequests, createCustomerRequest} from "./customer-request.service.js";
import { getRoomById, getRoomsByIds } from './rooms.service.js';
import { getPaymentsByUserId } from '../../billing/services/payment.service.js'; // Asegúrate de importar esto

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
            const [bookings, user] = await Promise.all([
                getBookingsByUserId(userId),
                getUserById(userId)
            ]);

            const payments = await getPaymentsByUserId(userId);
            const roomIds = [...new Set(bookings.map(b => b.roomId))]; // IDs únicos
            const rooms = await Promise.all(roomIds.map(id => getRoomById(id)));

            const roomMap = Object.fromEntries(rooms.map(r => [r.id, r]));

            return bookings.map(booking => {
                const room = roomMap[booking.roomId];
                const payment = payments.find(p => p.roomId === booking.roomId);
                // Reordena para que id esté primero
                const { id, ...rest } = booking;
                return {
                    id,
                    ...rest,
                    guestName: user ? `${user.firstName} ${user.lastName}` : 'Desconocido',
                    roomNumber: room?.roomNumber || 'N/A',
                    roomType: room?.type || 'Tipo desconocido',
                    totalPrice: payment?.amount || 0,
                    // status de cuarto se puede actualizar tras eliminar
                };
            });

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
            // Reordena para que id esté primero
            const { id, ...rest } = booking;
            return {
                id,
                ...rest,
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
            const requests = await getCustomerRequests();
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
            // Guardar en serviceRequests (customer-request.service.js ya apunta a esa tabla)
            const created = await createCustomerRequest({
                ...requestData,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                history: []
            });
            return created;
        } catch (error) {
            console.error('Error enviando solicitud:', error);
            throw error;
        }
    },

    /**
     * Obtiene las notificaciones del huésped
     */
    async getGuestNotifications(userId) {
        try {
            const notifications = await getNotificationsByUserId(userId);
            return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error obteniendo notificaciones:', error);
            return [];
        }
    },

    /**
     * Elimina una reserva específica
     *
     * @param {number} bookingId - ID de la reserva a eliminar
     * @returns {Promise<void>}
     * @throws {Error} - Si hay un error al eliminar
     */
    async deleteGuestBooking(bookingId) {
        try {
            // Validar bookingId antes de continuar
            if (!bookingId) {
                throw new Error('El id de la reserva es inválido');
            }
            // Obtener la reserva antes de eliminar para saber el roomId
            const booking = await getBookingById(bookingId);
            await deleteBooking(bookingId); // Si falla aquí, sí lanzamos error
            // Esperar un poco para asegurar que la eliminación se procese antes de actualizar el cuarto
            await new Promise(resolve => setTimeout(resolve, 200));
            // Cambiar el estado del cuarto a 'Available' después de eliminar la reserva usando PATCH
            if (booking && booking.roomId) {
                const API_ROOMS_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/rooms';
                const response = await fetch(`${API_ROOMS_URL}/${booking.roomId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'Available' })
                });
                if (!response.ok) {
                    // Log detallado para depuración, pero NO lanzamos error fatal
                    const errorText = await response.text();
                    console.warn(`La reserva fue eliminada, pero hubo un error actualizando la habitación ${booking.roomId}:`, response.status, errorText);
                }
            }
        } catch (error) {
            // Solo lanzamos error si falla la eliminación, no el update del cuarto
            if (error.message && error.message.includes('No se pudo eliminar la reserva')) {
                throw new Error('No se pudo eliminar la reserva');
            } else {
                // Otros errores solo se loguean
                console.error('Error eliminando reserva (no fatal):', error);
            }
        }
    },

    /**
     * Devuelve las habitaciones asociadas a los bookings del usuario
     * @param {number} userId
     * @returns {Promise<Array>} habitaciones del usuario
     */
    async getUserRooms(userId) {
        try {
            const bookings = await getBookings();
            const userBookings = bookings.filter(b => b.userId === userId);
            const roomIds = [...new Set(userBookings.map(b => b.roomId))];
            if (roomIds.length === 0) return [];
            // getRoomsByIds debe devolver un array de rooms dado un array de ids
            const rooms = await getRoomsByIds(roomIds);
            return rooms;
        } catch (error) {
            console.error('Error obteniendo habitaciones del usuario:', error);
            return [];
        }
    },

};