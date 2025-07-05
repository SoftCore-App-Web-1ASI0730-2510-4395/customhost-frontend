// src/crm/services/hotels.service.js

import apiClient from '../../shared/services/api-service.js';
import Hotel from '../model/hotels.entity';

const API_URL = '/api/v1/hotel';

/**
 * Obtiene todos los hoteles y devuelve instancias del modelo Hotel
 */
export const getHotels = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data.map(hotel => new Hotel(hotel));
    } catch (error) {
        console.error('Error al obtener hoteles:', error);
        return [];
    }
};

/**
 * Obtiene un hotel por ID
 */
export const getHotelById = async (hotelId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${hotelId}`);
        return new Hotel(response.data);
    } catch (error) {
        console.error('Error al obtener hotel por ID:', error);
        throw error;
    }
};

/**
 * Crea un nuevo hotel
 * @param {Object} hotelData - { name, address, email, phone }
 * @returns {Promise<Object>} Hotel creado
 */
export const createHotel = async (hotelData) => {
    try {
        console.log('[createHotel] Payload enviado:', hotelData);
        const response = await apiClient.post(API_URL, hotelData);
        console.log('[createHotel] Respuesta recibida:', response);
        return response.data;
    } catch (error) {
        console.error('Error al crear hotel:', error);
        if (error.response) {
            console.error('Respuesta del backend:', error.response);
        }
        throw error;
    }
};
