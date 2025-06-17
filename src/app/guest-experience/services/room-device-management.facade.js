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
        roomDeviceService.resetRoomDeviceForm(form, selectedDeviceConfig, preferences)
};
