import axios from 'axios'
import IotDevice from '../model/iot-devices.entity.js'

const API_URL = 'http://localhost:3001/iotDevices'
const ROOMS_URL = 'http://localhost:3001/rooms'

export const getDevices = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data.map(d => new IotDevice(d))
    } catch (error) {
        console.error('Error fetching devices:', error)
        return []
    }
}

export const getDeviceById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`)
        return new IotDevice(response.data)
    } catch (error) {
        console.error(`Error fetching device ${id}:`, error)
        return null
    }
}

export const getDevicesByRoom = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}?roomId=${roomId}`)
        return response.data.map(d => new IotDevice(d))
    } catch (error) {
        console.error(`Error fetching devices for room ${roomId}:`, error)
        return []
    }
}

export const createDevice = async (deviceData) => {
    try {
        // Configuración por defecto basada en el tipo
        const defaultProperties = {
            sensor: { value: '0', unit: '' },
            actuator: { state: 'off', intensity: '0%' }
        }

        const deviceToCreate = {
            ...deviceData,
            properties: deviceData.properties || defaultProperties[deviceData.type] || {},
            customizable: deviceData.customizable !== false
        }

        const response = await axios.post(API_URL, deviceToCreate)

        // Obtener la habitación actual para actualizar su lista de dispositivos
        const roomResponse = await axios.get(`${ROOMS_URL}/${deviceData.roomId}`)
        const room = roomResponse.data

        await axios.patch(`${ROOMS_URL}/${deviceData.roomId}`, {
            iotDevices: [...room.iotDevices, response.data.id]
        })

        return new IotDevice(response.data)
    } catch (error) {
        console.error('Error creating device:', error)
        throw error
    }
}

export const updateDevice = async (id, deviceData) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, deviceData)
        return new IotDevice(response.data)
    } catch (error) {
        console.error(`Error updating device ${id}:`, error)
        throw error
    }
}

export const deleteDevice = async (id) => {
    try {
        // Primero obtener el dispositivo para saber a qué habitación pertenece
        const device = await getDeviceById(id)

        // Eliminar el dispositivo
        await axios.delete(`${API_URL}/${id}`)

        // Actualizar la habitación para remover el dispositivo
        if (device) {
            const roomResponse = await axios.get(`${ROOMS_URL}/${device.roomId}`)
            const room = roomResponse.data

            await axios.patch(`${ROOMS_URL}/${device.roomId}`, {
                iotDevices: room.iotDevices.filter(deviceId => deviceId !== id)
            })
        }

        return true
    } catch (error) {
        console.error(`Error deleting device ${id}:`, error)
        throw error
    }
}

export const updateDeviceProperties = async (id, properties) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, { properties })
        return new IotDevice(response.data)
    } catch (error) {
        console.error(`Error updating device ${id} properties:`, error)
        throw error
    }
}
