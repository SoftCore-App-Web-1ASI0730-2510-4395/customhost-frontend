export class IotDevice {
    constructor({ id, name, deviceType, configSchema, status, createdAt }) {
        this.id = id;
        this.name = name;
        this.deviceType = deviceType;
        // Si configSchema es string, intentar parsear a objeto
        if (typeof configSchema === 'string') {
            try {
                this.configSchema = JSON.parse(configSchema);
            } catch {
                this.configSchema = configSchema;
            }
        } else {
            this.configSchema = configSchema;
        }
        this.status = status;
        this.createdAt = createdAt;
    }
}
