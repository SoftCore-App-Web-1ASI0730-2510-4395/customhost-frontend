export default class Payment {
    constructor({
                    id,
                    bookingId,
                    userId,
                    hotelId,
                    roomId,
                    amount,
                    currency = 'USD',
                    paymentDate,
                    checkInDate, // <-- Añadido
                    status, // <-- Cambia de paymentStatus a status
                    paymentMethod,
                    createdAt
                }) {
        if (!id) throw new Error("Payment must have an ID");

        this.id = id;
        this.bookingId = bookingId;
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.amount = amount;
        this.currency = currency;
        // Si ya es Date, úsalo, si es string, conviértelo
        this.paymentDate = paymentDate instanceof Date ? paymentDate : (paymentDate ? new Date(paymentDate) : null);
        this.checkInDate = checkInDate instanceof Date ? checkInDate : (checkInDate ? new Date(checkInDate) : null); // <-- Añadido
        this.paymentStatus = status || 'pending'; // <-- Usa status
        this.paymentMethod = paymentMethod || null;
        this.createdAt = createdAt instanceof Date ? createdAt : (createdAt ? new Date(createdAt) : new Date());
    }

    /**
     * Devuelve el monto formateado como moneda
     */
    get formattedAmount() {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.currency
        }).format(this.amount);
    }

    /**
     * Verifica si el pago fue completado
     */
    get isPaid() {
        return this.paymentStatus === 'paid';
    }

    /**
     * Devuelve la fecha formateada
     */
    get formattedPaymentDate() {
        if (!this.paymentDate) return 'N/A';

        return this.paymentDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}