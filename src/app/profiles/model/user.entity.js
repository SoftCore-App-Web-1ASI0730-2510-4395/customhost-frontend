// src/profile/model/User.entity.js

export default class User {
    constructor({
                    id,
                    hotelId,
                    firstName,
                    lastName,
                    email,
                    password,
                    phone,
                    role,
                    createdAt
                }) {
        if (!id) throw new Error("User must have an ID");

        this.id = id;
        this.hotelId = hotelId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password; // En producción, no deberías tener la contraseña aquí
        this.phone = phone;
        this.role = role; // Ej: 'guest', 'staff', 'admin'
        this.createdAt = new Date(createdAt);
    }

    /**
     * Devuelve el nombre completo del usuario
     */
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Verifica si el usuario es un huésped
     */
    get isGuest() {
        return this.role === 'guest';
    }

    /**
     * Verifica si el usuario es parte del staff
     */
    get isStaff() {
        return this.role === 'staff';
    }

    /**
     * Verifica si el usuario es parte del admin
     */
    get isAdmin() {
        return this.role === 'admin';
    }

}