// customer-request.service.js
import axios from 'axios'
import CustomerRequest from '../model/customer-request.entity.js'

const API_URL = 'http://localhost:3001/serviceRequests'

// Helper para evitar repetición
const getAndModifyRequest = async (id, modifyFn) => {
    const response = await axios.get(`${API_URL}/${id}`)
    const request = new CustomerRequest(response.data)
    modifyFn(request)
    const updated = await axios.put(`${API_URL}/${id}`, request.toJSON())
    return new CustomerRequest(updated.data)
}

// --- Métodos públicos ---
export const getCustomerRequests = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data.map(request => new CustomerRequest(request))
    } catch (error) {
        console.error('Error fetching customer requests:', error)
        throw new Error('Could not load service requests')
    }
}

export const createCustomerRequest = async (requestData) => {
    const request = new CustomerRequest({
        ...requestData,
        createdAt: new Date().toISOString()
    })
    const response = await axios.post(API_URL, request.toJSON())
    return new CustomerRequest(response.data)
}


export const deleteCustomerRequest = async (id) => {
    await axios.delete(`${API_URL}/${id}`)
}

export const assignStaffToRequest = async (id, staffId) => {
    return getAndModifyRequest(id, request => request.assignStaff(staffId))
}

export const resolveCustomerRequest = async (id) => {
    return getAndModifyRequest(id, request => request.resolve())
}