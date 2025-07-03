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

        <!-- Stripe Elements SIMULADO -->
        <div class="mt-5">
          <h3 class="mb-2">Datos de la Tarjeta (Simulado Stripe)</h3>
          <form @submit.prevent="handlePayment">
            <div class="mb-3">
              <label>Número de tarjeta</label>
              <input v-model="card.number" maxlength="16" required class="input" placeholder="4242 4242 4242 4242" />
            </div>
            <div class="mb-3 flex gap-2">
              <div>
                <label>MM/AA</label>
                <input v-model="card.exp" maxlength="5" required class="input" placeholder="12/34" />
              </div>
              <div>
                <label>CVC</label>
                <input v-model="card.cvc" maxlength="4" required class="input" placeholder="123" />
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="p-button p-component">Confirmar y Pagar</button>
            </div>
          </form>
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
    const card = ref({ number: '', exp: '', cvc: '' });

    const loadPaymentData = async () => {
      try {
        const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
        console.log('selectedRoom recuperado:', selectedRoom);
        const userId = parseInt(localStorage.getItem('userId') || '1');
        const checkInDate = localStorage.getItem('checkInDate');
        const checkOutDate = localStorage.getItem('checkOutDate');

        // Validar que selectedRoom.price exista
        if (!selectedRoom || typeof selectedRoom.price === 'undefined') {
          alert('La habitación seleccionada no tiene precio. Por favor, vuelve a seleccionar la habitación.');
          router.push({ name: 'hotel-room-selection' });
          return;
        }

        // Calcular noches y totalPrice de forma robusta y simple
        let totalPrice = 0;
        let pricePerNight = 0;
        let nights = 1;
        if (selectedRoom && typeof selectedRoom.price !== 'undefined' && checkInDate && checkOutDate) {
          pricePerNight = Number(selectedRoom.price) || 0;
          const start = new Date(checkInDate);
          const end = new Date(checkOutDate);
          nights = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          nights = Math.max(1, Math.round(nights));
          totalPrice = pricePerNight * nights;
          localStorage.setItem('totalPrice', totalPrice.toString());
        } else {
          totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
        }


        const data = await PaymentFacade.preparePaymentData(userId, selectedRoom.id, selectedRoom.hotelId);

        paymentData.value = {
          ...data,
          checkInDate,
          checkOutDate,
          amount: totalPrice,
          nights,
          pricePerNight
        };

      } catch (error) {
        console.error('Error al cargar datos para pago:', error);
        router.push({ name: 'hotel-room-selection' }); // ❌ Sin await
      }
    };

    const handlePayment = async () => {
      // Validación reforzada para evitar pagos con total 0 o inválido
      if (!paymentData.value.amount || isNaN(paymentData.value.amount) || paymentData.value.amount <= 0) {
        console.warn('Intento de pago con monto inválido:', paymentData.value.amount);
        alert("El monto del pago no es válido. Por favor, revisa el resumen de tu reserva.");
        return;
      }
      // Validación simple de campos de tarjeta
      if (!card.value.number || !card.value.exp || !card.value.cvc) {
        alert('Por favor, completa los datos de la tarjeta');
        return;
      }
      loading.value = true;
      try {
        // Simular token de Stripe
        const fakeStripeToken = 'tok_' + Math.random().toString(36).substring(2, 15);
        // Calcular totalPrice de forma robusta antes de enviar
        const totalPrice = (paymentData.value.pricePerNight || 0) * (paymentData.value.nights || 1);
        await PaymentFacade.processPayment({
          userId: paymentData.value.user.id,
          roomId: paymentData.value.room.id,
          hotelId: paymentData.value.hotel.id,
          amount: totalPrice,
          totalPrice: totalPrice, // siempre calculado correctamente
          currency: 'USD',
          checkInDate: paymentData.value.checkInDate,
          checkOutDate: paymentData.value.checkOutDate,
          paymentMethod: 'credit_card',
          stripeToken: fakeStripeToken // Simulado
        });
        alert('✅ Pago realizado exitosamente');
        // Limpiar datos temporales
        localStorage.removeItem('selectedRoom');
        localStorage.removeItem('checkInDate');
        localStorage.removeItem('checkOutDate');
        localStorage.removeItem('totalPrice');
        // Redirigir
        router.push({ name: 'preferences' });
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