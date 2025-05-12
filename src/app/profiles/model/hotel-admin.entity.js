// src/models/HotelAdmin.js
export default class HotelAdmin {
    constructor({
                    id,
                    hotelId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    department,
                    role = 'admin',
                    createdAt,
                    hotelName,
                    hotelAddress,
                    hotelStatus,
                    totalRooms,
                    occupiedRooms,
                    cleaningRooms,
                    maintenanceRooms,
                    availableRooms
                }) {
        this.id = id;
        this.hotelId = hotelId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.role = role;
        this.createdAt = new Date(createdAt);
        this.hotelName = hotelName;
        this.hotelAddress = hotelAddress;
        this.hotelStatus = hotelStatus;
        this.totalRooms = totalRooms;
        this.occupiedRooms = occupiedRooms;
        this.cleaningRooms = cleaningRooms;
        this.maintenanceRooms = maintenanceRooms;
        this.availableRooms = availableRooms;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    toJSON() {
        return {
            id: this.id,
            hotelId: this.hotelId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            department: this.department,
            role: this.role,
            createdAt: this.createdAt.toISOString(),
            hotelName: this.hotelName,
            hotelAddress: this.hotelAddress,
            hotelStatus: this.hotelStatus,
            totalRooms: this.totalRooms,
            occupiedRooms: this.occupiedRooms,
            cleaningRooms: this.cleaningRooms,
            maintenanceRooms: this.maintenanceRooms,
            availableRooms: this.availableRooms
        };
    }
}