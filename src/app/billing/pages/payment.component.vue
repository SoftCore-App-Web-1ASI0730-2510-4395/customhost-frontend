<!--src/app/billing/pages/payment.component.vue -->

<template>
  <div class="surface-section px-4 py-8">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold">Realizar Pago</h2>
      <p>Confirma tu reserva y realiza el pago</p>
    </div>

    <div class="grid justify-content-center">
      <div class="col-12 md:col-8 lg:col-6">
        <!-- Tarjeta de resumen -->
        <PaymentSummaryCard :payment-data="paymentData" />

        <!-- Botón de pago -->
        <div class="mt-5 text-center">
          <pv-button label="Confirmar y Pagar" icon="pi pi-credit-card" @click="handlePayment" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentSummaryCard from '../component/payment-summary-card.component.vue';
import PaymentFacade from '../services/payment.facade';
import {onMounted, ref} from "vue";

export default {
  components: { PaymentSummaryCard },
  setup() {
    const paymentData = ref(null);

    // Datos simulados por ahora (luego vendrán desde localStorage)
    const userId = 1;
    const roomId = 1;
    const hotelId = 1;

    const loadPaymentData = async () => {
      try {
        const data = await PaymentFacade.preparePaymentData(userId, roomId, hotelId);
        paymentData.value = data;
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    const handlePayment = async () => {
      try {
        const result = await PaymentFacade.processPayment({
          ...paymentData.value,
          amount: paymentData.value.room.price * 4, // Ejemplo: 4 noches
          currency: 'USD',
          paymentMethod: 'credit_card'
        });

        alert('✅ Pago realizado exitosamente');
        // Redirigir a dashboard u otra pantalla
      } catch (error) {
        console.error('Error al pagar:', error);
        alert('❌ Hubo un problema al realizar el pago');
      }
    };

    onMounted(() => {
      loadPaymentData();
    });

    return {
      paymentData,
      handlePayment
    };
  }
};
</script>

<style>

.text-center {
  color: black;
}

</style>