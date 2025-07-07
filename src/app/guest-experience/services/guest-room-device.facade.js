import { getRoomById } from '../../crm/services/rooms.service.js';
import { getDevicesByRoom, updateRoomDevicePreferences, createRoomDevicePreference, getRoomDevicePreferenceByRoomDeviceId, getDeviceById } from './iot-device.service.js';
import apiClient from '../../shared/services/api-service.js';

// Ajusta estas rutas según la ubicación real en tu proyecto
import { getBookingsByUserId } from '../../crm/services/booking.service.js'; // ⬅️ Confirmar ruta
import { getUserById } from '../../profiles/services/user.service.js'; // ⬅️ Confirmar ruta
import { getHotelById } from '../../crm/services/hotels.service.js';

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
            const userResp = await apiClient.get(`/api/v1/users/${userId}`);
            user = userResp.data;
            console.log('[FACADE] Usuario obtenido:', user);
        } catch (e) {
            console.error('Error obteniendo usuario:', e);
            throw new Error("Usuario no encontrado");
        }
        // Obtener reservas del usuario
        const bookingsResp = await apiClient.get(`/api/v1/booking/user/${userId}`);
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
                const roomResp = await apiClient.get(`/api/v1/rooms/${roomId}`);
                const room = roomResp.data;
                console.log(`[FACADE] Habitación ${roomId}:`, room);
                let hotelName = null;
                if (room.hotelId) {
                    try {
                        const hotel = await getHotelById(room.hotelId);
                        hotelName = hotel?.name || null;
                        console.log(`[FACADE] Nombre del hotel para habitación ${roomId}:`, hotelName);
                    } catch (err) {
                        console.warn('No se pudo obtener el hotel para la habitación', roomId, 'hotelId:', room.hotelId, err);
                    }
                }
                // Obtener dispositivos de la habitación (room-devices)
                const devicesResp = await apiClient.get(`/api/v1/room-devices/room/${roomId}`);
                const devicesRaw = devicesResp.data;
                console.log(`[FACADE] Dispositivos room-devices para habitación ${roomId}:`, devicesRaw);

                // JOIN manual: obtener info completa del iotDevice para cada roomDevice
                const devicesWithPrefs = await Promise.all(devicesRaw.map(async (roomDevice) => {
                    let preferences = {};
                    try {
                        // Siempre obtener preferencias solo para este roomDeviceId
                        const prefResp = await apiClient.get(`/api/v1/room-device-preferences/room-device/${roomDevice.id}`);
                        if (prefResp.data && prefResp.data.preferences) {
                            // Si es string, parsear, si es objeto, asignar directo
                            if (typeof prefResp.data.preferences === 'string') {
                                try {
                                    preferences = JSON.parse(prefResp.data.preferences);
                                } catch (e) {
                                    console.error('[DEBUG] Error al parsear preferencias:', prefResp.data.preferences, e);
                                    preferences = {};
                                }
                            } else {
                                preferences = prefResp.data.preferences;
                            }
                        } else {
                            preferences = {};
                        }
                        console.log(`[FACADE] Preferencias para roomDeviceId ${roomDevice.id}:`, preferences);
                    } catch (err) {
                        // Si no hay preferencias, dejar objeto vacío
                        console.warn(`[FACADE] No hay preferencias para roomDeviceId ${roomDevice.id}`);
                        preferences = {};
                    }
                    // Obtener info completa del iotDevice
                    let ioTDevice = null;
                    try {
                        const iotResp = await apiClient.get(`/api/v1/io-t-devices/${roomDevice.iotDeviceId}`);
                        ioTDevice = iotResp.data;
                        console.log('[DEBUG] IoTDevice obtenido:', ioTDevice);
                    } catch (err) {
                        console.warn(`[FACADE] No se pudo obtener info de IoTDevice para roomDeviceId ${roomDevice.id}`, err);
                    }
                    const result = {
                        ...roomDevice,
                        iotDevice: ioTDevice,
                        preferences
                    };
                    console.log('[DEBUG] Resultado deviceWithPrefs:', result);
                    return result;
                }));
                console.log(`[FACADE] devicesWithPrefs para habitación ${roomId}:`, devicesWithPrefs);
                roomsWithDevices.push({ room, hotelName, devices: devicesWithPrefs });
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
     * Guarda la preferencia de un dispositivo en una habitación (RoomDevicePreference)
     * Solo permite PUT, nunca POST. Si no existe, lanza error claro.
     */
    async saveRoomDevicePreference(roomDeviceId, preferences) {
        // Buscar la preferencia existente para este roomDeviceId
        let existingPref = null;
        try {
            const resp = await apiClient.get(`/api/v1/room-device-preferences/room-device/${roomDeviceId}`);
            if (resp.data && resp.data.id) {
                existingPref = resp.data;
            } else {
                throw new Error('No existe preferencia previa para este dispositivo. El guest solo puede modificar (PUT), no crear (POST).');
            }
        } catch (e) {
            throw new Error('No existe preferencia previa para este dispositivo. El guest solo puede modificar (PUT), no crear (POST).');
        }
        // Hacer una copia profunda de las preferencias para evitar referencias compartidas
        const preferencesCopy = JSON.parse(JSON.stringify(preferences));
        const payload = {
            roomDeviceId,
            preferences: JSON.stringify(preferencesCopy)
        };
        try {
            // Solo PUT
            const response = await apiClient.put(`/api/v1/room-device-preferences/${existingPref.id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error guardando preferencia de RoomDevice:', error);
            throw error;
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
                    await this.saveRoomDevicePreference(device.roomDeviceId, device.preferences);
                }
            }
        }
        return true;
    }

    /**
     * Obtiene todos los dispositivos IoT
     */
    async fetchIoTDevices() {
        try {
            const resp = await apiClient.get('/api/v1/io-t-devices');
            return resp.data;
        } catch (e) {
            console.error('[GuestRoomDeviceFacade] Error al obtener IoT devices:', e);
            return [];
        }
    }

    /**
     * Obtiene la preferencia de un roomDevice por su ID
     */
    async getRoomDevicePreferenceByRoomDeviceId(roomDeviceId) {
        try {
            const resp = await apiClient.get(`/api/v1/room-device-preferences/room-device/${roomDeviceId}`);
            return resp.data;
        } catch (e) {
            console.error('[GuestRoomDeviceFacade] Error al obtener preferencia de roomDevice:', e);
            return null;
        }
    }

    /**
     * Actualiza la preferencia de un roomDevice existente (PUT)
     */
    async updateRoomDevicePreference(prefId, payload) {
        try {
            const resp = await apiClient.put(`/api/v1/room-device-preferences/${prefId}`, payload);
            return resp.data;
        } catch (e) {
            console.error('[GuestRoomDeviceFacade] Error al actualizar preferencia de roomDevice:', e);
            throw e;
        }
    }
}