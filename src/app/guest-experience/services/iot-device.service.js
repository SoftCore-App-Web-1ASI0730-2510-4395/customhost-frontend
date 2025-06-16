import axios from 'axios';
import { IotDevice} from "../model/iot-device.entity.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

console.log('API_URL:', API_URL);


export const iotDeviceService = {


    async getAllIotDevices() {
        const res = await axios.get(`${API_URL}/iotDevices`);
        return res.data.map(d => new IotDevice(d.id, d.name, d.deviceType, d.configSchema));
    },






};
