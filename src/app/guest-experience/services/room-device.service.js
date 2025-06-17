import axios from 'axios';
import { iotDeviceService } from '../services/iot-device.service.js';
import * as roomService from '../../crm/services/rooms.service.js';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const roomDeviceService = {

    async addRoomDevice(roomDevice) {
        return axios.post(`${API_URL}/roomDevices`, roomDevice);
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
        const roomDevicesRes = await axios.get(`${API_URL}/roomDevices?roomId=${roomId}`);
        const usedDeviceTypes = new Set(roomDevicesRes.data.map(rd => {
            const device = allDevices.find(d => d.id === rd.iotDeviceId);
            return device?.deviceType;
        }));
        return allDevices.filter(d => !usedDeviceTypes.has(d.deviceType));
    },

    async getRoomsWithDevices() {
        const [rooms, devices, roomDevices] = await Promise.all([
            roomService.getRooms(),
            iotDeviceService.getAllIotDevices(),
            axios.get(`${API_URL}/roomDevices`)
        ]);

        return rooms.map(room => {
            const assigned = roomDevices.data.filter(rd => rd.roomId === room.id);
            const devicesInRoom = assigned.map(rd => {
                const device = devices.find(d => d.id === rd.iotDeviceId);
                return {
                    roomDeviceId: rd.id,

                    name: device?.name ?? 'Desconocido',
                    type: device?.deviceType,
                    iotDeviceId: rd.iotDeviceId, //  NECESARIO para buscar preferencias
                    status: rd.status,
                    configSchema: device?.configSchema ?? {} // <-- Agregado para el modal
                };
            });

            return {
                id: room.id,
                number: room.number,
                type: room.type,
                status: room.status,
                devices: devicesInRoom
            };
        });
    },

    async updateRoomDeviceStatus(roomDeviceId, newStatus) {
        const existing = await axios.get(`${API_URL}/roomDevices/${roomDeviceId}`);
        const updated = {
            ...existing.data,
            status: newStatus
        };
        return axios.put(`${API_URL}/roomDevices/${roomDeviceId}`, updated);
    },

    async deleteRoomDevice(roomDeviceId) {
        return axios.delete(`${API_URL}/roomDevices/${roomDeviceId}`);
    }

}