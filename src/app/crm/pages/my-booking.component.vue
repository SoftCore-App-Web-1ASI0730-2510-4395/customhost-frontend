<template>
  <div class="surface-section px-4 py-8">
    <!-- Mensaje de éxito o error -->
    <div v-if="message" class="notification-box" :class="message.type">
      {{ message.text }}
    </div>

    <div class="text-3xl font-bold text-center mb-6">{{$t('myBooking.title')}}</div>

    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <div v-else-if="bookings.length > 0" class="grid">
      <div v-for="booking in bookings" :key="booking.id" class="col-12 md:col-6 lg:col-4">
        <BookingCard :booking="booking" @delete-booking="deleteBooking" />
      </div>
    </div>

    <div v-else class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-info-circle text-6xl text-blue-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">{{$t('myBooking.noActiveBookings')}}</span>
      <pv-button
          :label="$t('myBooking.goToReserve')"
          icon="pi pi-home"
          class="mt-4"
          @click="goToReserve"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BookingCard from '../components/booking-card.component.vue';
import GuestFacade from '../services/guest.facade.js';

export default {
  components: { BookingCard },
  setup() {
    const router = useRouter();
    const bookings = ref([]);
    const loading = ref(true);
    const message = ref(null);

    const showMessage = (text, type = 'success') => {
      message.value = { text: t(`myBooking.${type}`) || text, type };
      setTimeout(() => {
        message.value = null;
      }, 3000);
    };

    const loadBookings = async () => {
      loading.value = true;
      try {
        // Obtener userId real desde localStorage
        let userId = null;
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            userId = parsed.id;
          }
        } catch (e) {
          console.error('[my-booking] Error leyendo userId de localStorage:', e);
        }
        if (!userId) {
          showMessage('No se encontró usuario autenticado.', 'error');
          bookings.value = [];
          loading.value = false;
          return;
        }
        const data = await GuestFacade.getGuestBookings(userId);
        bookings.value = data;
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      } finally {
        loading.value = false;
      }
    };

    const deleteBooking = async (bookingId) => {
      if (!confirm($t('myBooking.confirmDelete')))
        return;
      loading.value = true;
      try {
        await GuestFacade.deleteGuestBooking(bookingId);
        showMessage('✅ La reserva se ha eliminado correctamente.', 'success');
      } catch (error) {
        // Mostrar mensaje de error real si existe
        const errorMsg = error?.message || 'No se pudo eliminar la reserva.';
        showMessage(`❌ ${errorMsg}`, 'error');
        console.error('Error al eliminar reserva:', error);
      } finally {
        // Siempre recargar las reservas, incluso si hay error
        await loadBookings();
        loading.value = false;
      }
    };

    const goToReserve = () => {
      router.push({ name: 'hotel-room-selection' });
    };

    onMounted(() => {
      loadBookings();
    });

    return {
      bookings,
      loading,
      message,
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

.notification-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}

.notification-box.success {
  background-color: #4CAF50;
}

.notification-box.error {
  background-color: #F44336;
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>