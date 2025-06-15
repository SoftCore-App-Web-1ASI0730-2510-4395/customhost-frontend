// src/crm/model/hotels.entity.js

export default class Hotel {
    constructor({
                    id,
                    name,
                    address,
                    email,
                    phone,
                    status,
                    createdAt,
                    adminId
                }) {
        if (!id) throw new Error("Hotel must have an ID");

        this.id = id;
        this.name = name;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.createdAt = new Date(createdAt);
        this.adminId = adminId;
    }

    /**
     * Devuelve el nombre completo del hotel
     */
    get fullName() {
        return this.name;
    }

    /**
     * Devuelve si el hotel está activo
     */
    get isActive() {
        return this.status === 'active';
    }

    /**
     * Devuelve la fecha formateada
     */
    get formattedCreatedAt() {
        return this.createdAt.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}