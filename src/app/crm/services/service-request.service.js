// src/crm/services/service-request.service.js

import axios from 'axios';
import ServiceRequest from '../model/service-request.entity';

const API_URL = 'http://localhost:3000/serviceRequests';

/**
 * Obtiene todas las solicitudes de servicio
 */
export const getServiceRequests = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.map(sr => new ServiceRequest(sr));
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        return [];
    }
};

/**
 * Obtiene una solicitud por ID
 */
export const getServiceRequestById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return new ServiceRequest(response.data);
    } catch (error) {
        console.error('Error al obtener solicitud:', error);
        throw error;
    }
};

/**
 * Crea una nueva solicitud
 */
export const createServiceRequest = async (requestData) => {
    try {
        const response = await axios.post(API_URL, requestData);
        return new ServiceRequest(response.data);
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        throw error;
    }
};

/**
 * Actualiza una solicitud
 */
export const updateServiceRequest = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return new ServiceRequest(response.data);
    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        throw error;
    }
};