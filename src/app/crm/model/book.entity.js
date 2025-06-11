// src/models/booking.entity.js
export class Booking {
    constructor({
                    id = '',
                    userId = '',
                    hotelId = '',
                    roomId = '',
                    checkInDate = new Date().toISOString(),
                    checkOutDate = new Date().toISOString(),
                    status = 'pending',
                    totalPrice = 0,
                    paymentStatus = 'unpaid'
                }) {
        this.id = id;
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.status = status;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
    }
}