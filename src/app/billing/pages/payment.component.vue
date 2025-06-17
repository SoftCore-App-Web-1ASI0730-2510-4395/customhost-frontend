<!-- src/billing/pages/payment.component.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold">Realizar Pago</h2>
      <p>Confirma tu reserva y realiza el pago</p>
    </div>

    <div v-if="loading" class="flex justify-content-center">
      <pv-progress-spinner />
    </div>

    <div v-else-if="paymentData" class="grid justify-content-center">
      <div class="col-12 md:col-8 lg:col-6">
        <!-- Tarjeta de resumen -->
        <PaymentSummaryCard :payment-data="paymentData" />

        <!-- Botón de pago -->
        <div class="mt-5 text-center">
          <pv-button label="Confirmar y Pagar" icon="pi pi-credit-card" @click="handlePayment" />
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-6">
      <i class="pi pi-info-circle text-4xl text-blue-500 mb-3"></i>
      <p>No se encontraron datos para realizar el pago. Por favor, selecciona nuevamente tu habitación.</p>
      <pv-button label="Volver a Seleccionar Habitación" icon="pi pi-arrow-left" @click="goBackToSelection" severity="secondary" outlined />
    </div>
  </div>
</template>

<script>
import PaymentSummaryCard from '../component/payment-summary-card.component.vue'; // ✅ Corregido
import PaymentFacade from '../services/payment.facade.js';

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: { PaymentSummaryCard },
  setup() {
    const router = useRouter();
    const paymentData = ref(null);
    const loading = ref(false);

    const loadPaymentData = async () => {
      try {
        const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
        const userId = parseInt(localStorage.getItem('userId') || '1');
        const checkInDate = localStorage.getItem('checkInDate');
        const checkOutDate = localStorage.getItem('checkOutDate');
        const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

        if (!selectedRoom) {
          throw new Error("No se encontró una habitación seleccionada");
        }

        const data = await PaymentFacade.preparePaymentData(userId, selectedRoom.id, selectedRoom.hotelId);

        paymentData.value = {
          ...data,
          checkInDate,
          checkOutDate,
          amount: totalPrice
        };

      } catch (error) {
        console.error('Error al cargar datos para pago:', error);
        router.push({ name: 'hotel-room-selection' }); // ❌ Sin await
      }
    };

    const handlePayment = async () => {
      if (!paymentData.value.amount || paymentData.value.amount <= 0) {
        alert("El monto del pago no es válido");
        return;
      }

      loading.value = true;

      try {
        await PaymentFacade.processPayment({
          userId: paymentData.value.user.id,
          roomId: paymentData.value.room.id,
          hotelId: paymentData.value.hotel.id,
          amount: paymentData.value.amount,
          currency: 'USD',
          checkInDate: paymentData.value.checkInDate,
          checkOutDate: paymentData.value.checkOutDate,
          paymentMethod: 'credit_card'
        });

        alert('✅ Pago realizado exitosamente');

        // Limpiar datos temporales
        localStorage.removeItem('selectedRoom');
        localStorage.removeItem('checkInDate');
        localStorage.removeItem('checkOutDate');
        localStorage.removeItem('totalPrice');

        // Redirigir
        router.push({ name: 'DashboardPage' });

      } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('❌ Hubo un problema al realizar el pago');
      } finally {
        loading.value = false;
      }
    };

    const goBackToSelection = () => {
      router.push({ name: 'hotel-room-selection' });
    };

    onMounted(() => {
      loadPaymentData();
    });

    return {
      paymentData,
      loading,
      handlePayment,
      goBackToSelection
    };
  }
};
</script>

<style scoped>
.text-center {
  color: black;
}
</style>