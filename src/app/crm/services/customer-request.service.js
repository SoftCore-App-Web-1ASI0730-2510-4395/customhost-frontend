import apiClient from '../../shared/services/api-service.js';
import CustomerRequest from '../model/customer-request.entity.js'

const API_URL = '/api/v1/crm/service-request'

// Helper para evitar repetición
const getAndModifyRequest = async (id, modifyFn) => {
    const response = await apiClient.get(`${API_URL}/${id}`)
    const request = new CustomerRequest(response.data)
    modifyFn(request)
    const updated = await apiClient.put(`${API_URL}/${id}`, request.toJSON())
    return new CustomerRequest(updated.data)
}

// --- Métodos públicos ---
export const getCustomerRequests = async () => {
    try {
        const response = await apiClient.get(API_URL)
        return response.data.map(request => new CustomerRequest(request))
    } catch (error) {
        console.error('Error fetching customer requests:', error)
        throw new Error('Could not load service requests')
    }
}

export const createCustomerRequest = async (requestData) => {
    // Validación de campos obligatorios y restricciones
    if (!requestData.title || requestData.title.length < 1 || requestData.title.length > 200) {
        throw new Error('El título es obligatorio y debe tener entre 1 y 200 caracteres.')
    }
    if (!requestData.description || requestData.description.length < 1 || requestData.description.length > 1000) {
        throw new Error('La descripción es obligatoria y debe tener entre 1 y 1000 caracteres.')
    }
    if (!requestData.type) {
        throw new Error('El tipo de solicitud es obligatorio.')
    }
    if (!requestData.priority) {
        throw new Error('La prioridad es obligatoria.')
    }
    if (!Number.isInteger(requestData.userId) || requestData.userId <= 0) {
        throw new Error('El userId debe ser un entero positivo.')
    }
    if (!Number.isInteger(requestData.hotelId) || requestData.hotelId <= 0) {
        throw new Error('El hotelId debe ser un entero positivo.')
    }
    if (!Number.isInteger(requestData.roomId) || requestData.roomId <= 0) {
        throw new Error('El roomId debe ser un entero positivo.')
    }
    const payload = {
        title: requestData.title,
        description: requestData.description,
        type: requestData.type,
        priority: requestData.priority,
        userId: requestData.userId,
        hotelId: requestData.hotelId,
        roomId: requestData.roomId
    }
    // Imprimir el payload antes de enviarlo
    console.log('Payload enviado a backend:', payload)
    try {
        const response = await apiClient.post(API_URL, payload)
        return new CustomerRequest(response.data)
    } catch (error) {
        if (error.response) {
            console.error('Respuesta de error del backend:', error.response.data)
        }
        throw error
    }
}


export const deleteCustomerRequest = async (id) => {
    await apiClient.delete(`${API_URL}/${id}`)
}

export const assignStaffToRequest = async (id, staffId) => {
    try {
        const response = await apiClient.patch(`/api/v1/crm/service-request/${id}/assign`, {
            staff_id: String(staffId)
        });
        return response.data;
    } catch (error) {
        console.error('Error al asignar staff:', error?.response?.data || error);
        throw error;
    }
}

export const resolveCustomerRequest = async (id) => {
    return getAndModifyRequest(id, request => request.resolve())
}