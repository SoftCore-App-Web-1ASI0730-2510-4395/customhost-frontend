import { iotDeviceService } from './staff/iot-device.service.js';
import { roomDeviceService } from './staff/room-device.service.js';
import { roomDevicePreferenceService } from './staff/room-device-preference.service.js';
import * as roomService from '../../crm/services/rooms.service.js';

export const RoomDeviceManagementFacade = {
    // IoT Devices
    getAllIotDevices: () => iotDeviceService.getAllIotDevices(),

    // Rooms
    getRooms: () => roomService.getRooms(),

    // Room Devices
    getAvailableDevicesForRoom: (roomId) => roomDeviceService.getAvailableDevicesForRoom(roomId),
    getRoomsWithDevices: () => roomDeviceService.getRoomsWithDevices(),
    updateRoomDeviceStatus: (roomDeviceId, newStatus) => roomDeviceService.updateRoomDeviceStatus(roomDeviceId, newStatus),


    // Preferences
    saveRoomDevicePreference: (pref) => roomDevicePreferenceService.saveRoomDevicePreference(pref),
    saveRoomDeviceConfig: (form, preferences) => roomDevicePreferenceService.saveRoomDeviceConfig(form, preferences),
    getPreferencesForRoomDevice: (roomId, iotDeviceId) => roomDevicePreferenceService.getPreferencesForRoomDevice(roomId, iotDeviceId),
    deleteRoomDeviceAndPreferences: (roomDeviceId) => roomDevicePreferenceService.deleteRoomDeviceAndPreferences(roomDeviceId),

    // Util
    resetRoomDeviceForm: (form, selectedDeviceConfig, preferences) =>
        roomDeviceService.resetRoomDeviceForm(form, selectedDeviceConfig, preferences),

    /**
     * Obtiene los dispositivos IoT de una habitación con la info completa y preferencias del usuario
     * @param {number} roomId
     * @param {number} userId
     * @returns {Promise<Array>} devices enriched
     */
    async getDevicesWithUserPreferences(roomId, userId) {
        if (!roomId) throw new Error('roomId no puede ser null o undefined');
        if (!userId) throw new Error('userId no puede ser null o undefined');
        // 1. Obtener todos los room-devices de la habitación (incluye ioTDevice)
        const roomDevices = await roomDeviceService.getDevicesForRoom(roomId); // debe traer ioTDevice
        // 2. Obtener todas las preferencias de usuario y filtrar por userId
        let allUserPrefs = [];
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${apiBase}/api/v1/user-device-preferences`);
            if (!response.ok) throw new Error('Respuesta no OK al obtener preferencias de usuario');
            const allPrefs = await response.json();
            allUserPrefs = allPrefs.filter(p => p.userId === userId);
        } catch (err) {
            console.error('Error obteniendo preferencias de usuario:', err);
            allUserPrefs = [];
        }
        // 3. Mapear cada roomDevice a un objeto enriquecido
        return roomDevices.map(rd => {
            const pref = allUserPrefs.find(p => p.deviceId === rd.ioTDeviceId);
            return {
                id: rd.id,
                roomDeviceId: rd.id,
                ioTDeviceId: rd.ioTDeviceId,
                name: pref?.customName || rd.ioTDevice?.name || 'Dispositivo',
                type: rd.ioTDevice?.deviceType || '',
                configSchema: rd.ioTDevice?.configSchema ? JSON.parse(rd.ioTDevice.configSchema) : {},
                status: rd.status,
                preferences: pref?.overrides ? JSON.parse(pref.overrides) : {},
                lastUpdated: pref?.lastUpdated || null
            };
        });
    }
};
