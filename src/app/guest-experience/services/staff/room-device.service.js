import axios from 'axios';
import { iotDeviceService } from './iot-device.service.js';
import * as roomService from '../../../crm/services/rooms.service.js';


const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export const roomDeviceService = {

    async addRoomDevice(roomDevice) {
        return axios.post(`${API_URL}/room-devices`, roomDevice);
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
        const roomDevicesRes = await axios.get(`${API_URL}/room-devices/room/${roomId}`);
        const usedDeviceTypes = new Set(roomDevicesRes.data.map(rd => {
            const device = allDevices.find(d => d.id === rd.iotDeviceId);
            return device?.deviceType;
        }));
        return allDevices.filter(d => !usedDeviceTypes.has(d.deviceType));
    },

    async getRoomsWithDevices() {
        // Consumir el nuevo endpoint que ya retorna la estructura anidada
        const response = await axios.get('http://localhost:5232/api/v1/rooms/with-devices');
        return response.data;
    },

    async updateRoomDeviceStatus(roomDeviceId, newStatus) {
        const existing = await axios.get(`${API_URL}/room-devices/${roomDeviceId}`);
        const updated = {
            ...existing.data,
            status: newStatus
        };
        return axios.put(`${API_URL}/room-devices/${roomDeviceId}`, updated);
    },

    async deleteRoomDevice(roomDeviceId) {
        return axios.delete(`${API_URL}/room-devices/${roomDeviceId}`);
    }

}