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
     * Realiza la reserva y luego el pago asociado
     *
     * @param {Object} paymentData - Datos del pago a guardar
     * @returns {Promise<{payment: Payment, booking: any}>} - Pago y reserva creados
     */
    async processPayment(paymentData) {
        try {
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
            const API_ROOMS_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/rooms';
            // 1. Obtener los datos actuales de la habitación
            const getResponse = await fetch(`${API_ROOMS_URL}/${roomId}`);
            if (!getResponse.ok) {
                throw new Error(`No se pudo obtener la habitación ${roomId}`);
            }
            const roomData = await getResponse.json();
            // 2. Modificar solo el campo status
            const updatedRoom = { ...roomData, status: 'Occupied' };
            // 3. Enviar PUT con todos los campos completos
            const putResponse = await fetch(`${API_ROOMS_URL}/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRoom)
            });
            if (!putResponse.ok) {
                throw new Error(`Error updating room ${roomId}`);
            }
            return await putResponse.json();
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