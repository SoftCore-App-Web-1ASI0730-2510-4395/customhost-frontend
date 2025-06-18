<!-- src/app/crm/pages/my-booking.component.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Mis Reservas</div>

    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <div v-else-if="bookings.length > 0" class="grid">
      <div v-for="booking in bookings" :key="booking.id" class="col-12 md:col-6 lg:col-4">
        <BookingCard :booking="booking" />
      </div>
    </div>

    <div v-else class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-info-circle text-6xl text-blue-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">No tienes ninguna reserva activa.</span>
      <pv-button label="Ir a Reservar Habitación" icon="pi pi-home" class="mt-4" @click="goToReserve" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BookingCard from '../components/guests/booking-card.component.vue';
import GuestFacade from '../services/guest.facade.js';

export default {
  components: { BookingCard },
  setup() {
    const router = useRouter();
    const bookings = ref([]);
    const loading = ref(true);

    const loadBookings = async () => {
      loading.value = true;
      try {
        // Suponiendo que el ID del usuario viene desde autenticación o sesión
        const userId = 1; // TODO: Reemplazar por auth store o dinámico
        const data = await GuestFacade.getGuestBookings(userId);
        bookings.value = data;
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      } finally {
        loading.value = false;
      }
    };

    const deleteBooking = async (bookingId) => {
      if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;

      try {
        await GuestFacade.deleteGuestBooking(bookingId);
        // Recargar las reservas
        await loadBookings();
      } catch (error) {
        alert('No se pudo eliminar la reserva. Inténtalo más tarde.');
        console.error('Error al eliminar reserva:', error);
      }
    };

    const goToReserve = () => {
      router.push({ name: 'SelectHotelRoom' }); // Asegúrate de tener esta ruta definida
    };

    onMounted(() => {
      loadBookings();
    });

    return {
      bookings,
      loading,
      goToReserve,
      deleteBooking
    };
  }
};
</script>

<style scoped>
.surface-section {
  background-color: #f8f9fa;
}
.text-3xl {
  color: #343a40;
}
</style>