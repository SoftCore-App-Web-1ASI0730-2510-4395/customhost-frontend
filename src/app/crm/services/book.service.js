// src/services/booking.service.js
import { Booking } from '../model/book.entity.js';

const API_URL = 'http://localhost:3000/bookings'; // Simulando JSON Server

export default {
    async getAll() {
        const res = await fetch(API_URL);
        const data = await res.json();
        return data.map(item => new Booking(item));
    },

    async getById(id) {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        return new Booking(data);
    },

    async create(bookingData) {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        const data = await res.json();
        return new Booking(data);
    },

    async update(id, bookingData) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        const data = await res.json();
        return new Booking(data);
    },

    async deleteById(id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        return id;
    }
};