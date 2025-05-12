// src/services/booking.service.js
import axios from 'axios'
import Booking from '../model/booking.entity'

const API_URL = 'http://localhost:3001/bookings'
const USERS_URL = 'http://localhost:3001/users'
const ROOMS_URL = 'http://localhost:3001/rooms'

/**
 * Obtiene todas las reservas + usuarios + habitaciones y une los datos
 */
export const getBookingsWithDetails = async () => {
    try {
        const [bookingsRes, usersRes, roomsRes] = await Promise.all([
            axios.get(API_URL),
            axios.get(USERS_URL),
            axios.get(ROOMS_URL)
        ])

        const bookings = bookingsRes.data.map(b => new Booking(b))
        const users = usersRes.data
        const rooms = roomsRes.data

        return bookings.map(booking => {
            const user = users.find(u => u.id === booking.userId)
            const room = rooms.find(r => r.id === booking.roomId)

            return {
                ...booking,
                user,
                room,
                fullName: user ? `${user.firstName} ${user.lastName}` : 'Desconocido',
                roomNumber: room?.number || 'N/A'
            }
        })
    } catch (error) {
        console.error('Error al cargar reservas:', error)
        return []
    }
}

/**
 * Crea una nueva reserva
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(API_URL, bookingData)
        return new Booking(response.data)
    } catch (error) {
        console.error('Error al crear reserva:', error)
        throw error
    }
}

/**
 * Actualiza una reserva existente
 */
export const updateBooking = async (id, bookingData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, bookingData)
        return new Booking(response.data)
    } catch (error) {
        console.error('Error al actualizar reserva:', error)
        throw error
    }
}

/**
 * Elimina una reserva por ID
 */
export const deleteBooking = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`)
    } catch (error) {
        console.error('Error al eliminar reserva:', error)
        throw error
    }
}