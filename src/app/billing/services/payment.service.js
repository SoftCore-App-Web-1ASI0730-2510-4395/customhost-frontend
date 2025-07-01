import axios from 'axios';
import Payment from '../model/payment.entity';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/payments';

/**
 * Obtiene todos los pagos de un usuario
 */
export const getPaymentsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}?userId=${userId}`);
        return response.data.map(p => new Payment(p));
    } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
    }
};

/**
 * Crea un nuevo pago en la base de datos
 */
export const createPayment = async (paymentData) => {
    try {
        // Solo enviar los campos requeridos por el backend
        const {
            bookingId,
            userId,
            hotelId,
            roomId,
            amount,
            currency,
            paymentDate,
            status,
            paymentMethod
        } = paymentData;
        const response = await axios.post(API_URL, {
            bookingId,
            userId,
            hotelId,
            roomId,
            amount,
            currency,
            paymentDate,
            status,
            paymentMethod
        });

        return new Payment(response.data);
    } catch (error) {
        console.error('Error creando el pago:', error?.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene todos los pagos
 * @param {any} paramurl - Parámetro opcional para filtrar pagos
 */
export const getAllPayments = async (paramurl) => {
    try {
        let url = API_URL;
        if (paramurl) {
            // Si es un objeto, construye query string
            if (typeof paramurl === 'object') {
                const params = new URLSearchParams(paramurl).toString();
                url += `?${params}`;
            } else if (typeof paramurl === 'string') {
                url += `?${paramurl}`;
            }
        }
        const response = await axios.get(url);
        return response.data.map(p => new Payment(p));
    } catch (error) {
        console.error('Error fetching all payments:', error);
        return [];
    }
};