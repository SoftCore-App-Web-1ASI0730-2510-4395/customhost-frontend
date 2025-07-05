// src/crm/model/rooms.entity.js

export default class Room {
    constructor({
                    id,
                    hotelId,
                    roomNumber,
                    type,
                    status,
                    price,
                    floor
                }) {
        // Solo exigir id si ya existe (por ejemplo, al obtener del backend)
        if (id !== undefined && id !== null) {
            this.id = id;
        }
        this.hotelId = hotelId;
        this.roomNumber = roomNumber;
        this.type = type;
        this.status = status;
        this.price = price;
        this.floor = floor;
    }

    /**
     * Devuelve si el cuarto está disponible
     */
    get isAvailable() {
        return this.status === 'Available';
    }

    /**
     * Devuelve una descripción corta del tipo de cuarto
     */
    get shortDescription() {
        return `${this.type} - Piso ${this.floor}`;
    }
}