// src/dashboard/application/guest.facade.js

import {
    getGuestBookings,
    getGuestServiceRequests,
    getGuestNotifications
} from '../../crm/services/guest.facade.js';

/**
 * Devuelve todos los datos relevantantes para el dashboard del huésped
 */
export default {
    async getGuestDashboardData(userId) {
        try {
            const [bookings, serviceRequests, notifications] = await Promise.all([
                getGuestBookings(userId),
                getGuestServiceRequests(userId),
                getGuestNotifications(userId)
            ]);

            // Obtener reserva activa
            const currentBooking = bookings.find(b => b.isActive) || null;

            // Datos de habitación simulados (pueden venir del modelo Room si lo tienes cargado)
            const currentRoom = currentBooking ? {
                id: currentBooking.roomId,
                number: currentBooking.roomNumber,
                floor: 1, // Esto debería venir de un servicio real
                type: "Deluxe"
            } : null;

            // Notificaciones recientes
            const recentNotifications = notifications.filter(n => !n.read).slice(0, 3);

            return {
                currentBooking,
                currentRoom,
                notifications: recentNotifications,
                activeBookingsCount: bookings.filter(b => b.isActive).length,
                pendingRequestsCount: serviceRequests.filter(r => r.status !== 'Resolved').length,
                unreadNotificationsCount: notifications.filter(n => !n.read).length
            };

        } catch (error) {
            console.error('Error obteniendo datos del dashboard:', error);
            return {
                currentBooking: null,
                currentRoom: null,
                notifications: [],
                activeBookingsCount: 0,
                pendingRequestsCount: 0,
                unreadNotificationsCount: 0
            };
        }
    }
};