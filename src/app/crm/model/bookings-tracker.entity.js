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
                }) {
        this.id = id;
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.checkInDate = new Date(checkInDate);
        this.checkOutDate = new Date(checkOutDate);
        this.status = status;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
        this.user = null;
        this.room = null;
    }
}