// src/guest-experience/model/iot-devices.entity.js

export default class IotDevice {
    constructor({
                    id,
                    name,
                    type,
                    deviceType,
                    roomId,
                    status,
                    properties,
                    customizable
                }) {
        if (!id) throw new Error("IotDevice must have an ID");

        this.id = id;
        this.name = name;
        this.type = type; // Ejemplo: "sensor", "actuator"
        this.deviceType = deviceType; // Ejemplo: "climate", "lighting"
        this.roomId = roomId;
        this.status = status || 'online'; // Puede ser "online", "offline", etc.
        this.properties = properties || {}; // Propiedades específicas del dispositivo
        this.customizable = customizable !== false; // Indica si el dispositivo es personalizable
    }

    /**
     * Devuelve si el dispositivo está en línea
     */
    get isOnline() {
        return this.status === 'online';
    }

    /**
     * Devuelve una descripción corta del dispositivo
     */
    get shortDescription() {
        return `${this.name} (${this.type})`;
    }
}