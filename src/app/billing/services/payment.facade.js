// src/app/billing/services/payment.facade.js

import { getUserById } from '../../profiles/services/user.service.js';
import { getRoomById } from '../../crm/services/rooms.service.js';
import { getHotelById } from '../../crm/services/hotels.service.js';
import { createPayment, getAllPayments } from './payment.service.js';

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
        try {
            const [user, room, hotel] = await Promise.all([
                getUserById(userId),
                getRoomById(roomId),
                getHotelById(hotelId)
            ]);

            if (!user || !room || !hotel) {
                throw new Error("Datos incompletos para realizar el pago");
            }

            return {
                user,
                room,
                hotel
            };
        } catch (error) {
            console.error('Error al preparar datos del pago:', error);
            throw error;
        }
    },

    /**
     * Realiza el pago y crea una reserva (booking) asociada
     *
     * @param {Object} paymentData - Datos del pago a guardar
     * @returns {Promise<Payment>} - Pago creado
     */
    async processPayment(paymentData) {
        try {
            // 1. Guardar el pago
            const createdPayment = await createPayment({
                ...paymentData,
                status: 'paid',
                paymentDate: new Date().toISOString()
            });

            // 2. Crear una reserva (booking) basada en este pago
            const bookingData = {
                userId: paymentData.userId,
                roomId: paymentData.roomId,
                checkInDate: paymentData.checkInDate,
                checkOutDate: paymentData.checkOutDate,
                status: 'confirmed'
            };
            // Si el backend retorna un id, asegúrate de ponerlo primero al crear el objeto de booking
            // Pero aquí bookingData aún no tiene id, el id lo asigna el backend en createBooking
            const createdBooking = await createBooking(bookingData);
            // Si quieres que el id esté primero en el objeto final:
            const { id, ...rest } = createdBooking;
            const orderedBooking = { id, ...rest };

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
            const API_ROOMS_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/rooms';
            const response = await fetch(`${API_ROOMS_URL}/${roomId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Occupied' })
            });

            if (!response.ok) {
                throw new Error(`Error updating room ${roomId}`);
            }

            return await response.json();
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
    }
};