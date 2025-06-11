export class IotDevice {
    constructor(id, name, deviceType, configSchema) {
        this.id = id;
        this.name = name;
        this.deviceType = deviceType;
        this.configSchema = configSchema;
        // Ejemplo: { brightness: "number", color: ["white", "yellow"] }
    }
}
