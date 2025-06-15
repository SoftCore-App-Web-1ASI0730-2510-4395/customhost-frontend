// src/model/booking.entity.js
export default class Booking {
    constructor({
                    id,
                    userId,
                    hotelId,
                    roomId,
                    checkInDate,
                    checkOutDate,
                    status,
                    totalPrice,
                    paymentStatus,
                    specialRequests,
                    createdAt,
                    preferences = {},
                    appliedDevicePreferences = []
                }) {
        if (!id) throw new Error("Booking must have an ID");

        function isValidDate(dateString) {
            const date = new Date(dateString);
            return !isNaN(date.getTime()) && date instanceof Date;
        }
        if (!checkInDate || !isValidDate(checkInDate)) throw new Error("Invalid check-in date");
        if (!checkOutDate || !isValidDate(checkOutDate)) throw new Error("Invalid check-out date");

        this.id = id;
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.checkInDate = new Date(checkInDate);
        this.checkOutDate = new Date(checkOutDate);
        this.status = status;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
        this.specialRequests = specialRequests;
        this.createdAt = new Date(createdAt);
        this.preferences = preferences;
        this.appliedDevicePreferences = appliedDevicePreferences;

        // Relaciones externas (opcional, se cargan desde servicios)
        this.user = null;
        this.room = null;
    }

    get guestName() {
        return this.user ? `${this.user.firstName} ${this.user.lastName}` : 'Desconocido';
    }

    get roomNumber() {
        return this.room?.number || 'N/A';
    }

    get daysOfStay() {
        const diff = Math.abs(this.checkOutDate - this.checkInDate);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    get pricePerNight() {
        return this.daysOfStay > 0 ? (this.totalPrice / this.daysOfStay).toFixed(2) : 0;
    }

    get isActive() {
        return this.status === 'active';
    }
}