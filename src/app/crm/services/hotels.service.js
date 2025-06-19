// src/crm/services/hotels.service.js

import axios from 'axios';
import Hotel from '../model/hotels.entity';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/hotels';

/**
 * Obtiene todos los hoteles y devuelve instancias del modelo Hotel
 */
export const getHotels = async () => {
    try {
        const response = await axios.get(API_URL);
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
        const response = await axios.get(`${API_URL}/${hotelId}`);
        return new Hotel(response.data);
    } catch (error) {
        console.error('Error al obtener hotel por ID:', error);
        throw error;
    }
};