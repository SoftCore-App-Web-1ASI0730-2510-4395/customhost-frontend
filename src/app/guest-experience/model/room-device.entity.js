export class RoomDevice {
    constructor(id, roomId, iotDeviceId, status) {
        this.id = id;
        this.roomId = roomId;
        this.iotDeviceId = iotDeviceId;
        this.status = status; // 'working', 'maintenance', 'inactive'
    }
}
