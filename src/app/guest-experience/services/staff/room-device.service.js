import apiClient from '../../../shared/services/api-service.js';
import { iotDeviceService } from './iot-device.service.js';
import * as roomService from '../../../crm/services/rooms.service.js';


const API_URL = '/api/v1';

export const roomDeviceService = {

    async addRoomDevice(roomDevice) {
        return apiClient.post(`${API_URL}/room-devices`, roomDevice);
    },

    resetRoomDeviceForm(form, selectedDeviceConfig, preferences) {
        form.roomId = '';
        form.iotDeviceId = '';
        form.status = '';
        selectedDeviceConfig.value = null;
        preferences.value = {};
    },

    async getAvailableDevicesForRoom(roomId) {
        const allDevices = await iotDeviceService.getAllIotDevices();
        const roomDevicesRes = await apiClient.get(`${API_URL}/room-devices/room/${roomId}`);
        const usedDeviceTypes = new Set(roomDevicesRes.data.map(rd => {
            const device = allDevices.find(d => d.id === rd.ioTDeviceId);
            return device?.deviceType;
        }));
        console.log('❌ usedDeviceTypes:', [...usedDeviceTypes]); // <--- 🔍

        const filtered = allDevices.filter(d => !usedDeviceTypes.has(d.deviceType));
        console.log('✅ availableDevices:', filtered); // <--- 🔍

        return filtered;
    },

    async getRoomsWithDevices() {
        // Consumir el nuevo endpoint que ya retorna la estructura anidada
        const response = await apiClient.get('/api/v1/rooms/with-devices');
        return response.data;
    },

    async updateRoomDeviceStatus(roomDeviceId, newStatus) {
        const existing = await apiClient.get(`${API_URL}/room-devices/${roomDeviceId}`);
        const updated = {
            ...existing.data,
            status: newStatus
        };
        return apiClient.put(`${API_URL}/room-devices/${roomDeviceId}`, updated);
    },

    async deleteRoomDevice(roomDeviceId) {
        return apiClient.delete(`${API_URL}/room-devices/${roomDeviceId}`);
    },

    async getDevicesForRoom(roomId) {
        const response = await apiClient.get(`${API_URL}/room-devices/room/${roomId}`);
        return response.data;
    }

}