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
     * Obtiene los dispositivos IoT de una habitación con la info completa y preferencias del dispositivo en ese cuarto
     * @param {number} roomId
     * @returns {Promise<Array>} devices enriched
     */
    async getDevicesWithRoomDevicePreferences(roomId) {
        if (!roomId) throw new Error('roomId no puede ser null o undefined');
        // 1. Obtener todos los room-devices de la habitación (incluye ioTDevice)
        const roomDevices = await roomDeviceService.getDevicesForRoom(roomId); // debe traer ioTDevice
        // 2. Obtener todas las preferencias de room-device
        let allRoomDevicePrefs = [];
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${apiBase}/api/v1/room-device-preferences`);
            if (!response.ok) throw new Error('Respuesta no OK al obtener preferencias de room-device');
            allRoomDevicePrefs = await response.json();
        } catch (err) {
            console.error('Error obteniendo preferencias de room-device:', err);
            allRoomDevicePrefs = [];
        }
        // 3. Mapear cada roomDevice a un objeto enriquecido
        return roomDevices.map(rd => {
            const pref = allRoomDevicePrefs.find(p => p.roomDeviceId === rd.id);
            return {
                id: rd.id,
                roomDeviceId: rd.id,
                ioTDeviceId: rd.ioTDeviceId,
                name: rd.ioTDevice?.name || 'Dispositivo',
                type: rd.ioTDevice?.deviceType || '',
                configSchema: rd.ioTDevice?.configSchema ? JSON.parse(rd.ioTDevice.configSchema) : {},
                status: rd.status,
                preferences: pref?.preferences ? (typeof pref.preferences === 'string' ? JSON.parse(pref.preferences) : pref.preferences) : {},
                lastUpdated: pref?.createdAt || null
            };
        });
    }
};
