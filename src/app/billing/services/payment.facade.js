// src/app/billing/services/payment.facade.js

import { getRoomById } from '../../crm/services/rooms.service.js';
import { getHotelById } from '../../crm/services/hotels.service.js';
import { createPayment, getAllPayments, deleteSubscription } from './payment.service.js';
import apiClient from '../../shared/services/api-service.js';

// 👇 Importa servicio de bookings
import { createBooking } from '../../crm/services/booking.service.js';

/**
 * Coordina la información entre contextos para preparar y realizar un pago
 */
export default {
    /**
     * Prepara los datos del pago con info del usuario, hotel y habitación
     */
    async preparePaymentData(userId, roomId, hotelId) {
        // Obtener userId real desde localStorage si no se pasa uno válido
        let realUserId = userId;
        if (!realUserId || isNaN(realUserId)) {
            // Obtener userId desde useAuth (reactivo global)
            try {
                const { useAuth } = await import('../../shared/composables/useAuth.js');
                const auth = useAuth();
                if (auth.user?.value) {
                    // Mostrar el objeto user para depuración
                    console.log('[preparePaymentData] user de useAuth:', auth.user.value);
                    // Intenta con los campos más comunes
                    realUserId = auth.user.value.id || auth.user.value.userId || auth.user.value.user?.id || auth.user.value.user?.userId;
                    console.log('[preparePaymentData] userId detectado de useAuth:', realUserId);
                }
            } catch (e) {
                // fallback a localStorage
                const userData = JSON.parse(localStorage.getItem('userData'));
                realUserId = userData?.id || userData?.userId || userData?.user?.id || userData?.user?.userId;
                console.log('[preparePaymentData] userId detectado de localStorage:', realUserId, userData);
            }
        } else {
            console.log('[preparePaymentData] userId recibido como argumento:', realUserId);
        }
        // Validación final de userId
        if (!realUserId || isNaN(realUserId)) {
            // Forzar a usar el id de localStorage si existe
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData && userData.id) {
                realUserId = userData.id;
                console.warn('[preparePaymentData] userId forzado desde localStorage:', realUserId);
            } else {
                console.error('[preparePaymentData] No se pudo determinar un userId válido.');
                throw new Error('No se pudo determinar el usuario para el pago. Por favor, inicia sesión nuevamente.');
            }
        }
        try {
            // Solo obtener user desde localStorage, no llamar a getUserById
            const userData = JSON.parse(localStorage.getItem('userData'));
            let user = null;
            if (userData && userData.id) {
                user = {
                    id: userData.id,
                    username: userData.username || userData.name || '',
                    email: userData.email || '',
                    role: userData.role || '',
                    // Puedes agregar más campos si los necesitas
                };
                console.warn('[preparePaymentData] Usuario creado desde localStorage:', user);
            } else {
                console.error('[preparePaymentData] No se pudo crear el usuario desde localStorage.');
            }
            // Obtener room y hotel normalmente
            const [room, hotel] = await Promise.all([
                getRoomById(roomId),
                getHotelById(hotelId)
            ]);
            console.log('[preparePaymentData] Resultado getRoomById:', room);
            console.log('[preparePaymentData] Resultado getHotelById:', hotel);
            if (!user || !room || !hotel) {
                console.error('[preparePaymentData] Datos incompletos:', { user, room, hotel });
                throw new Error("Datos incompletos para realizar el pago");
            }

            return {
                user,
                room,
                hotel,
                guestName: user.username || user.name || user.fullName || ''
            };
        } catch (error) {
            console.error('Error al preparar datos del pago:', error);
            throw error;
        }
    },

    /**
     * Realiza la reserva y luego el pago asociado
     *
     * @param {Object} paymentData - Datos del pago a guardar
     * @returns {Promise<{payment: Payment, booking: any}>} - Pago y reserva creados
     */
    async processPayment(paymentData) {
        try {
            // Validar totalPrice antes de crear la reserva
            if (!paymentData.totalPrice || isNaN(paymentData.totalPrice) || paymentData.totalPrice <= 0) {
                console.error('No se puede crear la reserva: totalPrice inválido:', paymentData.totalPrice);
                throw new Error('El monto total de la reserva es inválido. No se puede procesar el pago.');
            }
            // 1. Crear la reserva (booking) primero
            const bookingData = {
                userId: paymentData.userId,
                hotelId: paymentData.hotelId, // agregado
                roomId: paymentData.roomId,
                checkInDate: paymentData.checkInDate,
                checkOutDate: paymentData.checkOutDate,
                totalPrice: paymentData.totalPrice, // agregado
                status: 'confirmed'
            };
            const createdBooking = await createBooking(bookingData);
            const { id: bookingId, ...rest } = createdBooking;
            const orderedBooking = { id: bookingId, ...rest };

            // 2. Guardar el pago usando el bookingId generado
            const createdPayment = await createPayment({
                ...paymentData,
                bookingId, // ahora sí existe
                status: 'paid',
                paymentDate: new Date().toISOString()
            });

            // 3. Marcar habitación como "Occupied"
            await this.markRoomAsOccupied(paymentData.roomId);

            // Retornamos ambos datos
            return {
                payment: createdPayment,
                booking: orderedBooking
            };

        } catch (error) {
            console.error('Error al procesar el pago:', error);
            throw error;
        }
    },

    /**
     * Marca una habitación como ocupada
     */
    async markRoomAsOccupied(roomId) {
        try {
            // 1. Obtener los datos actuales de la habitación
            const roomData = await apiClient.get(`/api/v1/rooms/${roomId}`);
            
            // 2. Modificar solo el campo status
            const updatedRoom = { ...roomData.data, status: 'Occupied' };
            
            // 3. Enviar PUT con todos los campos completos
            const response = await apiClient.put(`/api/v1/rooms/${roomId}`, updatedRoom);
            
            return response.data;
        } catch (error) {
            console.error('Error marcando habitación como ocupada:', error);
            throw error;
        }
    },

    /**
     * Obtiene todos los pagos
     * @param {any} paramurl - Parámetro opcional para filtrar pagos
     * @returns {Promise<Array>} - Lista de pagos
     */
    async getAllPayments(paramurl) {
        return getAllPayments(paramurl);
    },

    /**
     * Cancela una suscripción por ID
     */
    async cancelSubscription(subscriptionId) {
        return await deleteSubscription(subscriptionId);
    }
};