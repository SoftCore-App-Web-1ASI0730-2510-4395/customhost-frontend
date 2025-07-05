import {RoomDevice} from "../../model/room-device.entity.js";
import {RoomDevicePreference} from "../../model/room-device-preference.entity.js";

import {roomDeviceService} from "./room-device.service.js";
import apiClient from '../../../shared/services/api-service.js';

const API_URL = '/api/v1';
export const roomDevicePreferenceService = {

    async saveRoomDevicePreference(preference) {
        const res = await apiClient.get(`${API_URL}/room-device-preferences?roomDeviceId=${preference.roomDeviceId}`);
        const existing = res.data[0];

        if (existing) {
            return apiClient.put(`${API_URL}/room-device-preferences/${existing.id}`, {
                ...existing,
                preferences: preference.preferences
            });
        } else {
            return apiClient.post(`${API_URL}/room-device-preferences`, {
                roomDeviceId: preference.roomDeviceId,
                preferences: preference.preferences
            });
        }
    },

    async saveRoomDeviceConfig(form, preferences) {
        // Crea y guarda RoomDevice y RoomDevicePreference

        const roomDevice = new RoomDevice(null, form.roomId, form.iotDeviceId, form.status);
        const res = await roomDeviceService.addRoomDevice(roomDevice);
        const roomDeviceId = res.data.id;
        const pref = new RoomDevicePreference(null, roomDeviceId, preferences);
        await this.saveRoomDevicePreference(pref);
        return res;
    },

    async getPreferencesForRoomDevice(roomId, iotDeviceId) {
        const roomDevicesRes = await apiClient.get(`${API_URL}/room-devices?roomId=${roomId}&iotDeviceId=${iotDeviceId}`);
        const roomDevice = roomDevicesRes.data[0];
        if (!roomDevice) return {};

        const prefsRes = await apiClient.get(`${API_URL}/room-device-preferences?roomDeviceId=${roomDevice.id}`);
        const prefs = prefsRes.data[0]?.preferences ?? {};

        return prefs;
    },

    async deleteRoomDeviceAndPreferences(roomDeviceId) {
        // Elimina preferencias si existen
        const res = await apiClient.get(`${API_URL}/room-device-preferences?roomDeviceId=${roomDeviceId}`);
        const preference = res.data[0];

        if (preference) {
            await apiClient.delete(`${API_URL}/room-device-preferences/${preference.id}`);
        }

        // Elimina el dispositivo
        await roomDeviceService.deleteRoomDevice(roomDeviceId);
    }





}