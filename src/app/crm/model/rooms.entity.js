// src/crm/model/rooms.entity.js

export default class Room {
    constructor({
                    id,
                    hotelId,
                    number,
                    type,
                    status,
                    price,
                    floor
                }) {
        if (!id) throw new Error("Room must have an ID");

        this.id = id;
        this.hotelId = hotelId;
        this.number = number;
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