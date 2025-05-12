// src/services/profile.service.js
import axios from 'axios'
import HotelAdmin from '../model/hotel-admin.entity.js'

const API_URL = 'http://localhost:3001'

/**
 * Obtiene info del admin + su hotel + estadísticas
 */
export const getAdminProfile = async (adminId) => {
    try {
        // Llamadas paralelas a endpoints
        const [userRes, hotelRes, roomRes] = await Promise.all([
            axios.get(`${API_URL}/users/${adminId}`),
            axios.get(`${API_URL}/hotels?adminId=${adminId}`),
            axios.get(`${API_URL}/rooms`)
        ])

        const user = userRes.data
        const hotels = hotelRes.data
        const rooms = roomRes.data

        if (!hotels.length) return null

        const hotel = hotels[0]
        const hotelRooms = rooms.filter(r => r.hotelId === hotel.id)

        const stats = {
            totalRooms: hotelRooms.length,
            occupiedRooms: hotelRooms.filter(r => r.status === 'occupied').length,
            cleaningRooms: hotelRooms.filter(r => r.status === 'cleaning').length,
            maintenanceRooms: hotelRooms.filter(r => r.status === 'maintenance').length,
            availableRooms: hotelRooms.filter(r => r.status === 'available').length,
        }

        // Devolver como instancia de HotelAdmin
        return new HotelAdmin({
            id: user.id,
            hotelId: hotel.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            department: user.department,
            createdAt: user.createdAt,
            hotelName: hotel.name,
            hotelAddress: hotel.address,
            hotelStatus: hotel.status,
            ...stats
        })

    } catch (error) {
        console.error('Error al cargar perfil:', error)
        return null
    }
}