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
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBookingsWithDetails } from '../services/bookings-tracker.service.js'
import BookingsTrackerTable from '../components/bookings-tracker-table.component.vue'

const { t } = useI18n()
const bookings = ref([])

onMounted(async () => {
  try {
    bookings.value = await getBookingsWithDetails()

    const usersResponse = await fetch('http://localhost:3001/api/v1/users').then(res => res.json())
    guests.value = usersResponse.filter(u => u.role === 'guest')

    const roomsResponse = await fetch('http://localhost:3001/api/v1/rooms').then(res => res.json())
    rooms.value = roomsResponse
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
})
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