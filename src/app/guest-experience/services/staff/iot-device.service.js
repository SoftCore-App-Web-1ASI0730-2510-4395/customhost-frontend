import apiClient from '../../../shared/services/api-service.js';
import { IotDevice} from "../../model/iot-device.entity.js";

const API_URL = '/api/v1';

console.log('API_URL:', API_URL);


export const iotDeviceService = {


    async getAllIotDevices() {
        const res = await apiClient.get(`${API_URL}/io-t-devices`);
        return res.data.map(d => new IotDevice(d));
    },






};
