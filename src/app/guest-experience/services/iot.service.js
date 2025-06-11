import axios from 'axios';
import { RoomDevice} from "../model/room-device.entity.js";
import { RoomDevicePreference } from "../model/room-device-preference.entity.js";
import { IotDevice} from "../model/iot-device.entity.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

console.log('API_URL:', API_URL);


export const iotService = {
    async getRoomDevicesWithConfigs(roomId) {
        const [roomDevicesRes, iotDevicesRes, preferencesRes] = await Promise.all([
            axios.get(`${API_URL}/roomDevices?roomId=${roomId}`),
            axios.get(`${API_URL}/iotDevices`),
            axios.get(`${API_URL}/roomDevicePreferences`)
        ]);

        return roomDevicesRes.data.map(rd => {
            const deviceData = iotDevicesRes.data.find(d => d.id === rd.iotDeviceId);
            const prefData = preferencesRes.data.find(p => p.roomDeviceId === rd.id);

            const device = new IotDevice(
                deviceData.id,
                deviceData.name,
                deviceData.deviceType,
                deviceData.configSchema
            );

            const roomDevice = new RoomDevice(
                rd.id,
                rd.roomId,
                rd.iotDeviceId,
                rd.status
            );

            const preferences = prefData
                ? new RoomDevicePreference(prefData.id, prefData.roomDeviceId, prefData.preferences)
                : new RoomDevicePreference(null, rd.id, {});

            return {
                roomDevice,
                device,
                preferences
            };
        });
    },

    async getAllIotDevices() {
        const res = await axios.get(`${API_URL}/iotDevices`);
        return res.data.map(d => new IotDevice(d.id, d.name, d.deviceType, d.configSchema));
    },

    async addRoomDevice(roomDevice) {
        return axios.post(`${API_URL}/roomDevices`, roomDevice);
    },

    async saveRoomDevicePreference(preference) {
        const res = await axios.get(`${API_URL}/roomDevicePreferences?roomDeviceId=${preference.roomDeviceId}`);
        const existing = res.data[0];

        if (existing) {
            return axios.put(`${API_URL}/roomDevicePreferences/${existing.id}`, {
                ...existing,
                preferences: preference.preferences
            });
        } else {
            return axios.post(`${API_URL}/roomDevicePreferences`, {
                roomDeviceId: preference.roomDeviceId,
                preferences: preference.preferences
            });
        }
    }
};
