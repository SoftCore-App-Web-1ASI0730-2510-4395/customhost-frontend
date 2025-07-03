<template>
  <div class="surface-section px-4 py-8">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold">Pago con Tarjeta</h2>
      <p>Ingresa los datos de tu tarjeta de crédito o débito de forma segura.</p>
    </div>
    <div v-if="loading" class="flex justify-content-center">
      <pv-progress-spinner />
    </div>
    <div v-else class="grid justify-content-center">
      <div class="col-12 md:col-8 lg:col-6">
        <PaymentSummaryCard :payment-data="paymentData" />
        <form @submit.prevent="handleStripePayment" class="mt-5">
          <div id="card-element" class="mb-4"></div>
          <div v-if="cardError" class="text-red-500 mb-2">{{ cardError }}</div>
          <div class="text-center">
            <button type="submit" class="p-button p-component" :disabled="processing">
              <span v-if="processing">Procesando...</span>
              <span v-else>Pagar con Tarjeta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PaymentSummaryCard from '../component/payment-summary-card.component.vue';
import PaymentFacade from '../services/payment.facade.js';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Rgj1MD30eatJd6RTi9Ex1irZpVOITB3yjdQQyHafsscXM2avy46uKS44F72df2dOwPfaqttZzLuXObwRRwBZzmG00x38AYTMC');

const router = useRouter();
const paymentData = ref(null);
const loading = ref(true);
const processing = ref(false);
const cardError = ref('');
let stripe = null;
let elements = null;
let cardElement = null;

const loadPaymentData = async () => {
  try {
    const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
    const userId = parseInt(localStorage.getItem('userId') || '1');
    const checkInDate = localStorage.getItem('checkInDate');
    const checkOutDate = localStorage.getItem('checkOutDate');
    const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
    if (!selectedRoom) throw new Error('No se encontró una habitación seleccionada');
    const data = await PaymentFacade.preparePaymentData(userId, selectedRoom.id, selectedRoom.hotelId);
    paymentData.value = {
      ...data,
      checkInDate,
      checkOutDate,
      amount: totalPrice
    };
  } catch (error) {
    router.push({ name: 'hotel-room-selection' });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadPaymentData();
  stripe = await stripePromise;
  elements = stripe.elements();
  cardElement = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': { color: '#a0aec0' },
        fontFamily: 'inherit',
      },
      invalid: { color: '#e53e3e' },
    },
  });
  cardElement.mount('#card-element');
});

const handleStripePayment = async () => {
  cardError.value = '';
  processing.value = true;
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });
  if (error) {
    cardError.value = error.message;
    processing.value = false;
    return;
  }
  try {
    await PaymentFacade.processPayment({
      userId: paymentData.value.user.id,
      roomId: paymentData.value.room.id,
      hotelId: paymentData.value.hotel.id,
      amount: paymentData.value.amount,
      totalPrice: paymentData.value.amount,
      currency: 'USD',
      checkInDate: paymentData.value.checkInDate,
      checkOutDate: paymentData.value.checkOutDate,
      paymentMethod: 'stripe',
      stripePaymentMethodId: paymentMethod.id
    });
    alert('✅ Pago realizado exitosamente');
    localStorage.removeItem('selectedRoom');
    localStorage.removeItem('checkInDate');
    localStorage.removeItem('checkOutDate');
    localStorage.removeItem('totalPrice');
    router.push({ name: 'preferences' });
  } catch (err) {
    cardError.value = 'Error al procesar el pago. Intenta de nuevo.';
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
#card-element {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  margin-bottom: 8px;
}
.text-center {
  color: black;
}
</style>

