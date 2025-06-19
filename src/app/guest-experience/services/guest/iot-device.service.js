// src/guest-experience/services/iot-device.service.js

import axios from 'axios';
import { IotDevice } from '../../model/iot-device.entity.js';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1/io-t-devices'; // Endpoint para dispositivos IoT

/**
 * Obtener todos los dispositivos
 */
export const getDevices = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('Datos recibidos desde API:', response.data);
        // Adaptar para pasar el objeto completo al constructor
        return response.data.map(d => new IotDevice(d));
    } catch (error) {
        console.error(
            'Error fetching devices:',
            error.message,
            error.response?.data || ''
        );
        return [];
    }
};

/**
 * Obtener dispositivo por ID
 */
export const getDeviceById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        console.log(`Dispositivo ${id} obtenido:`, response.data);
        return new IotDevice(response.data);
    } catch (error) {
        console.error(
            `Error fetching device ${id}:`,
            error.message,
            error.response?.data || ''
        );
        return null;
    }
};

/**
 * Obtener dispositivos por habitación (CORREGIDO)
 */
export const getDevicesByRoom = async (roomId) => {
    try {
        // Obtener roomDevices
        const roomDeviceResponse = await axios.get(`http://localhost:5232/room-devices?roomId=${roomId}`);
        const roomDevices = roomDeviceResponse.data;
        console.log('roomDevices:', roomDevices);

        if (!roomDevices.length) return [];

        // Obtener iotDevices
        const allIotDevicesResponse = await axios.get('http://localhost:5232/io-t-devices');
        const allIotDevices = allIotDevicesResponse.data;
        console.log('allIotDevices:', allIotDevices);

        // Obtener roomDevicePreferences
        const roomDevicePrefsResponse = await axios.get('http://localhost:5232/room-device-preferences');
        const roomDevicePreferences = roomDevicePrefsResponse.data;
        console.log('roomDevicePreferences:', roomDevicePreferences);

        // Mapear dispositivos con sus preferencias base y roomDeviceId
        const mapped = roomDevices.map(rd => {
            const iot = allIotDevices.find(i => i.id === rd.iotDeviceId);
            if (!iot) {
                console.warn('No se encontró IoT device para roomDevice:', rd, 'iotDeviceId:', rd.iotDeviceId);
            }
            const preference = roomDevicePreferences.find(p => p.roomDeviceId === rd.id);
            return {
                ...iot,
                roomDeviceId: rd.id,
                iotDeviceId: rd.iotDeviceId, // <-- Aseguramos que siempre esté presente
                roomDevicePreferenceId: preference?.id,
                status: rd.status,
                preferences: preference?.preferences || {}
            };
        });
        console.log('mapped devices:', mapped);
        return mapped;
    } catch (error) {
        console.error(`Error fetching devices for room ${roomId}:`, error);
        return [];
    }
};



/**
 * Crear dispositivo
 */
export const createDevice = async (deviceData) => {
    try {
        const defaultProperties = {
            sensor: { value: '0', unit: '' },
            actuator: { state: 'off', intensity: '0%' }
        };

        const deviceToCreate = {
            ...deviceData,
            properties: deviceData.properties || defaultProperties[deviceData.type] || {},
            customizable: deviceData.customizable !== false
        };

        const response = await axios.post(API_URL, deviceToCreate);
        console.log('Dispositivo creado:', response.data);
        return new IotDevice(response.data);
    } catch (error) {
        console.error(
            'Error creating device:',
            error.message,
            error.response?.data || ''
        );
        throw error;
    }
};

/**
 * Actualizar dispositivo
 */
export const updateDevice = async (id, deviceData) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, deviceData);
        console.log(`Dispositivo ${id} actualizado:`, response.data);
        return new IotDevice(response.data);
    } catch (error) {
        console.error(
            `Error updating device ${id}:`,
            error.message,
            error.response?.data || ''
        );
        throw error;
    }
};

/**
 * Eliminar dispositivo
 */
export const deleteDevice = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        console.log(`Dispositivo ${id} eliminado`);
        return true;
    } catch (error) {
        console.error(
            `Error deleting device ${id}:`,
            error.message,
            error.response?.data || ''
        );
        throw error;
    }
};

/**
 * Actualizar propiedades del dispositivo
 */
export const updateDeviceProperties = async (id, properties) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, { properties });
        console.log(`Propiedades del dispositivo ${id} actualizadas`);
        return new IotDevice(response.data);
    } catch (error) {
        console.error(
            `Error updating device ${id} properties:`,
            error.message,
            error.response?.data || ''
        );
        throw error;
    }
};

/**
 * Crear preferencia de un roomDevice (POST)
 */
export const createRoomDevicePreference = async (roomDeviceId, preferences) => {
    try {
        const response = await axios.post('http://localhost:5232/room-device-preferences', {
            roomDeviceId,
            preferences
        });
        console.log(`Preferencia creada para roomDeviceId ${roomDeviceId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error creando preferencia para roomDeviceId ${roomDeviceId}:`,
            error.message,
            error.response?.data || ''
        );
        throw error;
    }
};

/**
 * Actualiza las preferencias de un roomDevice (PATCH)
 */
export const updateRoomDevicePreferences = async (roomDevicePreferenceId, preferences) => {
    try {
        const response = await axios.patch(`http://localhost:5232/room-device-preferences/${roomDevicePreferenceId}`, {
            preferences
        });
        console.log(`Preferencias del roomDevicePreference ${roomDevicePreferenceId} actualizadas`);
        return response.data;
    } catch (error) {
        console.error(
            `Error actualizando preferencias de roomDevicePreference ${roomDevicePreferenceId}:`,
            error.message,
            error.response?.data || ''
        );
        throw error;
    }
};

/**
 * Obtiene la preferencia de un roomDevice por roomDeviceId
 */
export const getRoomDevicePreferenceByRoomDeviceId = async (roomDeviceId) => {
    try {
        const response = await axios.get(`http://localhost:5232/room-device-preferences?roomDeviceId=${roomDeviceId}`);
        return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        console.error(
            `Error obteniendo preferencia para roomDeviceId ${roomDeviceId}:`,
            error.message,
            error.response?.data || ''
        );
        return null;
    }
};