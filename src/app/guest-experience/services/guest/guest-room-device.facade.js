import { getRoomById } from '../../../crm/services/rooms.service.js';
import { getDevicesByRoom } from './iot-device.service.js';
import { saveUserDevicePreference, getUserDevicePreferences } from '../../../profiles/services/user-preference.service.js';

// Ajusta estas rutas según la ubicación real en tu proyecto
import { getBookingsByUserId } from '../../../crm/services/booking.service.js'; // ⬅️ Confirmar ruta
import { getUserById } from '../../../profiles/services/user.service.js'; // ⬅️ Confirmar ruta

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
        const user = await getUserById(1);
        if (!user) throw new Error("Usuario no encontrado");

        const bookings = await getBookingsByUserId(1); // Obtiene las reservas del usuario
        const roomIds = [...new Set(bookings.map(b => b.roomId))]; // ID únicos de cuartos
        const roomsWithDevices = [];

        for (const roomId of roomIds) {
            try {
                const room = await getRoomById(roomId); // Obtener habitación por ID
                const devices = await getDevicesByRoom(roomId); // Obtener dispositivos por habitación
                roomsWithDevices.push({ room, devices });
            } catch (error) {
                console.error(`Error al cargar habitación con ID ${roomId}:`, error);
            }
        }

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
     * Obtiene las preferencias existentes del usuario
     */
    async getUserPreferences(userId) {
        return await getUserDevicePreferences(userId);
    }
}