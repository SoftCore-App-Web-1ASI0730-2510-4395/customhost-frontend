export class RoomDevice {
    constructor(id, roomId, ioTDeviceId, status) {
        this.id = id;
        this.roomId = roomId;
        this.ioTDeviceId = ioTDeviceId;
        this.status = status; // 'working', 'maintenance', 'inactive'
    }
}
