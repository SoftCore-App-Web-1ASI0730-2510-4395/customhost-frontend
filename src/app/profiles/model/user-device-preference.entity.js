// src/profile/model/UserDevicePreference.entity.js

export default class UserDevicePreference {
    constructor({
                    id,
                    userId,
                    deviceId,
                    customName,
                    overrides,
                    lastUpdated
                }) {
        if (!id) throw new Error("UserDevicePreference must have an ID");

        this.id = id;
        this.userId = userId;
        this.deviceId = deviceId;
        this.customName = customName || '';
        this.overrides = overrides || {}; // Ej: { brightness: 85, color: 'cool' }
        this.lastUpdated = new Date(lastUpdated);
    }

    /**
     * Devuelve si esta preferencia tiene configuraciones personalizadas
     */
    get hasOverrides() {
        return Object.keys(this.overrides).length > 0;
    }

    /**
     * Devuelve la fecha formateada
     */
    get formattedLastUpdated() {
        return this.lastUpdated.toLocaleString('es-ES');
    }
}