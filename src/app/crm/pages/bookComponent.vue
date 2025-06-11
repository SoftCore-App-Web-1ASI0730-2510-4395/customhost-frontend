<!-- src/views/BookingPage.vue -->
<template>
  <div class="booking-page">
    <pv-card class="mb-4">
      <template #title> Mis Reservas </template>
      <template #content>
        <pv-data-table :value="bookings" responsiveLayout="scroll">
          <pv-column field="hotelId" header="Hotel ID"></pv-column>
          <pv-column field="roomId" header="Habitación"></pv-column>
          <pv-column field="checkInDate" header="Entrada">
            <template #body="{ data }">
              {{ formatDate(data.checkInDate) }}
            </template>
          </pv-column>
          <pv-column field="checkOutDate" header="Salida">
            <template #body="{ data }">
              {{ formatDate(data.checkOutDate) }}
            </template>
          </pv-column>
          <pv-column field="status" header="Estado"></pv-column>
          <pv-column field="paymentStatus" header="Pago"></pv-column>
          <pv-column header="Acciones">
            <template #body="{ data }">
              <pv-button icon="pi pi-pencil" rounded severity="info" @click="editBooking(data.id)" />
              <pv-button icon="pi pi-trash" rounded severity="danger" @click="deleteBooking(data.id)" class="ml-2" />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>

    <pv-card>
      <template #title> Nueva Reserva </template>
      <template #content>
        <BookingForm @on-save="loadBookings" />
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BookingForm from '../components/booking.component.vue';
import bookingService from '../services/book.service.js';

const router = useRouter();
const bookings = ref([]);

async function loadBookings() {
  bookings.value = await bookingService.getAll();
}

function editBooking(id) {
  router.push(`/bookings/edit/${id}`);
}

async function deleteBooking(id) {
  await bookingService.deleteById(id);
  loadBookings();
}

onMounted(() => {
  loadBookings();
});
</script>

<style scoped>
.booking-page {
  padding: 1rem;
}
</style>