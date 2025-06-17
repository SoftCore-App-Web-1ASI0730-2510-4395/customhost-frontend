// src/guest-experience/facade/guest-room-device.facade.js

import { getRoomById } from '../../crm/services/rooms.service.js';
import { getDevicesByRoom } from './guest/iot-devices.service.js';
import { saveUserDevicePreference } from '../../profiles/services/user-preference.service.js';


export default class GuestRoomDeviceFacade {
    constructor() {}

    /**
     * Obtiene una habitación y sus dispositivos IoT
     */  async getRoomWithDevices(roomId) {
        const room = await getRoomById(roomId);
        const devices = await getDevicesByRoom(room.id);
        return { room, devices };
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
     * Obtiene las preferencias existentes del usuario
     */
    async getUserPreferences(userId) {
        return await getUserDevicePreferences(userId);
    }
}