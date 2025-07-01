import { getRoomById } from '../../../crm/services/rooms.service.js';
import { getDevicesByRoom, updateRoomDevicePreferences, createRoomDevicePreference, getRoomDevicePreferenceByRoomDeviceId, getDeviceById } from './iot-device.service.js';
import axios from 'axios';

// Ajusta estas rutas según la ubicación real en tu proyecto
import { getBookingsByUserId } from '../../../crm/services/booking.service.js'; // ⬅️ Confirmar ruta
import { getUserById } from '../../../profiles/services/user.service.js'; // ⬅️ Confirmar ruta

import.meta.env && import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL : '';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class GuestRoomDeviceFacade {
    constructor() {}

    /**
     * Obtiene una habitación y sus dispositivos IoT
     */
    async getRoomWithDevices(roomId) {
        const room = await getRoomById(roomId);
        const devices = await getDevicesByRoom(room.id);
        return { room, devices };
    }

    /**
     * Obtiene todas las habitaciones reservadas por el usuario + sus dispositivos IoT
     */
    async getUserRoomsAndDevices(userId) {
        // Forzar userId a 1
        userId = 1;
        let user = null;
        try {
            const userResp = await axios.get(`${API_BASE_URL}/api/v1/users/${userId}`);
            user = userResp.data;
            console.log('[FACADE] Usuario obtenido:', user);
        } catch (e) {
            console.error('Error obteniendo usuario:', e);
            throw new Error("Usuario no encontrado");
        }
        // Obtener reservas del usuario
        const bookingsResp = await axios.get(`${API_BASE_URL}/api/v1/booking/user/${userId}`);
        const bookings = bookingsResp.data;
        console.log('[FACADE] Bookings del usuario:', bookings);
        if (!bookings || bookings.length === 0) {
            return { user, rooms: [] };
        }
        const roomIds = [...new Set(bookings.map(b => b.roomId))];
        console.log('[FACADE] roomIds:', roomIds);
        const roomsWithDevices = [];
        for (const roomId of roomIds) {
            try {
                const roomResp = await axios.get(`${API_BASE_URL}/api/v1/rooms/${roomId}`);
                const room = roomResp.data;
                console.log(`[FACADE] Habitación ${roomId}:`, room);
                let hotel = null;
                if (room.hotelId) {
                    try {
                        const hotelResp = await axios.get(`${API_BASE_URL}/api/v1/hotel/${room.hotelId}`);
                        hotel = hotelResp.data;
                        console.log(`[FACADE] Hotel para habitación ${roomId}:`, hotel);
                    } catch (err) {
                        console.warn('No se pudo obtener el hotel para la habitación', roomId, 'hotelId:', room.hotelId, err);
                    }
                }
                // Obtener dispositivos de la habitación (room-devices)
                const devicesResp = await axios.get(`${API_BASE_URL}/api/v1/room-devices/room/${roomId}`);
                const devicesRaw = devicesResp.data;
                console.log(`[FACADE] Dispositivos room-devices para habitación ${roomId}:`, devicesRaw);

                // JOIN manual: obtener info completa del iotDevice para cada roomDevice
                const devicesWithPrefs = await Promise.all(devicesRaw.map(async (roomDevice) => {
                    let preferences = {};
                    try {
                        const prefResp = await axios.get(`${API_BASE_URL}/api/v1/room-device-preferences/room-device/${roomDevice.id}`);
                        if (prefResp.data && prefResp.data.preferences) {
                            preferences = prefResp.data.preferences;
                        }
                        console.log(`[FACADE] Preferencias para roomDeviceId ${roomDevice.id}:`, preferences);
                    } catch (err) {
                        console.warn(`[FACADE] No hay preferencias para roomDeviceId ${roomDevice.id}`);
                    }
                    // Obtener info completa del iotDevice
                    let ioTDevice = null;
                    try {
                        const iotResp = await axios.get(`${API_BASE_URL}/api/v1/io-t-devices/${roomDevice.iotDeviceId}`);
                        ioTDevice = iotResp.data;
                    } catch (err) {
                        console.warn(`[FACADE] No se pudo obtener info de IoTDevice para roomDeviceId ${roomDevice.id}`);
                    }
                    return {
                        ...roomDevice,
                        ...(ioTDevice || {}),
                        preferences
                    };
                }));
                console.log(`[FACADE] devicesWithPrefs para habitación ${roomId}:`, devicesWithPrefs);
                roomsWithDevices.push({ room, hotel, devices: devicesWithPrefs });
            } catch (error) {
                console.error(`Error al cargar habitación con ID ${roomId}:`, error);
            }
        }
        console.log('[FACADE] Resultado final roomsWithDevices:', roomsWithDevices);
        return { user, rooms: roomsWithDevices };
    }

    /**
     * Guarda una preferencia del usuario para un dispositivo
     */
    async savePreference(userId, deviceId, customName, overrides) {
        return await saveUserDevicePreference({
            userId,
            deviceId,
            customName,
            overrides
        });
    }

    /**
     * Guarda la preferencia de un dispositivo en una habitación (para IoT)
     * Si existe la preferencia, actualiza (PATCH); si no, crea (POST)
     * @param {Object} params - { roomDeviceId, preferences }
     */
    async saveRoomDevicePreference({ roomDeviceId, preferences }) {
        // Buscar si ya existe la preferencia
        const existingPref = await getRoomDevicePreferenceByRoomDeviceId(roomDeviceId);
        if (existingPref) {
            // PATCH
            return await updateRoomDevicePreferences(existingPref.id, preferences);
        } else {
            // POST
            return await createRoomDevicePreference(roomDeviceId, preferences);
        }
    }

    /**
     * Obtiene las preferencias existentes del usuario
     */
    async getUserPreferences(userId) {
        return await getUserDevicePreferences(userId);
    }

    /**
     * Actualiza las preferencias de una habitación (solo roomDevicePreferences)
     */
    async updateRoomPreferences(roomId, { devices }) {
        if (Array.isArray(devices)) {
            for (const device of devices) {
                // Se espera que cada device tenga roomDeviceId y preferences
                if (device.roomDeviceId && device.preferences) {
                    await this.saveRoomDevicePreference({
                        roomDeviceId: device.roomDeviceId,
                        preferences: device.preferences
                    });
                }
            }
        }
        return true;
    }
}