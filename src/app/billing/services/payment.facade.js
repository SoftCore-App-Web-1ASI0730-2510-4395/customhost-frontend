// src/app/billing/services/payment.facade.js

import { getUserById } from '../../profiles/services/user.service.js';
import { getRoomById } from '../../crm/services/rooms.service.js';
import { getHotelById } from '../../crm/services/hotels.service.js';
import { createPayment } from './payment.service.js';

const API_ROOMS_URL = 'http://localhost:3001/api/v1/rooms'; // ← URL correcta para actualizar el estado del cuarto

/**
 * Coordina la información entre contextos para preparar y realizar un pago
 */
export default {
    /**
     * Prepara los datos del pago con info del usuario, hotel y habitación
     *
     * @param {number} userId - ID del usuario actual
     * @param {number} roomId - ID de la habitación seleccionada
     * @param {number} hotelId - ID del hotel
     * @returns {Promise<Object>} - Objeto con toda la info necesaria para pagar
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
     * Realiza el pago y marca la habitación como ocupada
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

            // 2. Actualizar el estado de la habitación a "Occupied"
            await this.markRoomAsOccupied(paymentData.roomId);

            return createdPayment;
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            throw error;
        }
    },

    /**
     * Marca una habitación como ocupada
     *
     * @param {number} roomId - ID de la habitación
     */
    async markRoomAsOccupied(roomId) {
        try {
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
    }
};