import axios from 'axios'
import Booking from '../model/bookings-tracker.entity.js'

const API_URL = 'http://localhost:3001/api/v1/bookings'
const USERS_URL = 'http://localhost:3001/api/v1/users'
const ROOMS_URL = 'http://localhost:3001/api/v1/rooms'

// Obtiene todas las reservas + usuarios + habitaciones y une los datos
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