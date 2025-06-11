export class RoomDevicePreference {
    constructor(id, roomDeviceId, preferences) {
        this.id = id;
        this.roomDeviceId = roomDeviceId;
        this.preferences = preferences; // JSON object, ejemplo: { brightness: 80 }
    }
}
