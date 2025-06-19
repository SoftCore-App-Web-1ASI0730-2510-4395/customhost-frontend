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
        const response = await axios.post(API_URL, {
            ...paymentData,
            createdAt: new Date().toISOString()
        });

        return new Payment(response.data);
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

/**
 * Obtiene todos los pagos
 */
export const getAllPayments = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.map(p => new Payment(p));
    } catch (error) {
        console.error('Error fetching all payments:', error);
        return [];
    }
};
