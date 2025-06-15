<template>
  <div class="book-room-page">
    <h1>Reservar Habitación</h1>

    <!-- Componente del formulario de reserva -->
    <BookingForm/>

    <!-- Mostrar historial de reservas (ejemplo) -->
    <div class="booking-history" v-if="bookings.length">
      <h2>Mis Reservas</h2>
      <ul>
        <li v-for="booking in bookings" :key="booking.id">
          {{ booking.roomId }} - {{ formatDate(booking.checkInDate) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import BookingForm from '../components/booking.component.vue';
import BookingService from '../services/book.service.js'; // Asegúrate de que la ruta sea correcta

import { ref, onMounted } from 'vue';

// Instancia del servicio
const bookingService = new BookingService();

// Estado reactivo para almacenar las reservas
const bookings = ref([]);

// Cargar reservas al montar la página
onMounted(async () => {
  try {
    bookings.value = await bookingService.getAll();
  } catch (error) {
    console.error('Error al cargar las reservas:', error);
  }
});

// Función auxiliar para formatear fechas
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>

<style scoped>
.book-room-page {
  padding: 2rem;
  max-width: 800px;
  margin: auto;
}

.booking-history {
  margin-top: 2rem;
}

.booking-history ul {
  list-style: none;
  padding-left: 0;
}

.booking-history li {
  padding: 0.5rem 0;
}
</style>