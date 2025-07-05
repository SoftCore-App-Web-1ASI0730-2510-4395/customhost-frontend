<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0" style="color: black">{{ t('dashboard.bookings_tracker.booksTracking') }}</h2>
      <div class="hotel-title text-xl font-bold">
        Hotel Cheraton - {{ t('dashboard.bookings_tracker.books') }}
      </div>
    </div>

    <bookings-tracker-table
        :bookings="bookings"
        @delete-booking="onDeleteBooking"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBookingsWithDetails, deleteBooking } from '../services/booking.service.js'
import BookingsTrackerTable from '../components/bookings-tracker-table.component.vue'


// Datos reactivos
const {t} = useI18n()
const bookings = ref([])

onMounted(async () => {
  try {
    // Cargamos las reservas con detalles de huésped y habitación
    bookings.value = await getBookingsWithDetails()

    const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1'
    const usersResponse = await fetch(`${API_URL}/users`).then(res => res.json())
    guests.value = usersResponse.filter(u => u.role === 'guest')

    const roomsResponse = await fetch(`${API_URL}/rooms`).then(res => res.json())
    rooms.value = roomsResponse
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
})

const onDeleteBooking = async (id) => {
  try {
    await deleteBooking(id)
    bookings.value = bookings.value.filter(b => b.id !== id)
  } catch (error) {
    console.error('Error al eliminar la reserva:', error)
    // Aquí puedes mostrar un mensaje al usuario si lo deseas
  }
}
</script>

<style scoped>
.hotel-title {
  color: #1a237e;
  letter-spacing: 1px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.25rem;
  font-weight: bold;
  white-space: nowrap;
}
</style>