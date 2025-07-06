<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../../shared/services/api-service.js';

const props = defineProps({
  hotelId: { type: Number, required: true },
  subscriptionPlan: { type: Object, required: true }
});

const emit = defineEmits(['payment-success']);

const loading = ref(false);
const error = ref('');
const toast = useToast();
const router = useRouter();
const showSuccess = ref(false);
const processing = ref(false);
const cardError = ref('');
let stripe = null;
let elements = null;
let cardElement = null;

const stripePromise = loadStripe('pk_test_51Rgj1MD30eatJd6RTi9Ex1irZpVOITB3yjdQQyHafsscXM2avy46uKS44F72df2dOwPfaqttZzLuXObwRRwBZzmG00x38AYTMC');

// Obtener hotelId desde localStorage (si existe)
const hotelId = Number(localStorage.getItem('currentHotelId'));

function getStartAndEndDate() {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
}

onMounted(async () => {
  await nextTick();
  if (!document.getElementById('card-element')) return;
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

async function handleStripePayment() {
  cardError.value = '';
  processing.value = true;
  const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });
  if (stripeError) {
    cardError.value = stripeError.message;
    processing.value = false;
    return;
  }
  try {
    // Obtener el id del último hotel creado
    const hotelsResponse = await apiClient.get('/api/v1/hotel');
    const hotels = hotelsResponse.data;
    const lastHotel = hotels[hotels.length - 1];
    const lastHotelId = lastHotel ? lastHotel.id : null;
    if (!lastHotelId) {
      cardError.value = 'No se pudo obtener el hotel.';
      processing.value = false;
      return;
    }
    const { startDate, endDate } = getStartAndEndDate();
    const payload = {
      hotelId: lastHotelId, // Usar el id del último hotel creado
      subscriptionPlanId: props.subscriptionPlan.id,
      status: 'ACTIVE',
      startDate,
      endDate,
      stripePaymentMethodId: paymentMethod.id
    };
    await apiClient.post('/api/v1/subscription', payload);
    toast.add({ severity: 'success', summary: 'Pago realizado', detail: 'Suscripción activada correctamente.', life: 2000 });
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
      router.push('/iam/login');
    }, 3500);
    emit('payment-success');
  } catch (err) {
    cardError.value = err.response?.data?.message || 'Error al procesar el pago.';
  } finally {
    processing.value = false;
  }
}
</script>

<template>
  <div class="hotel-subscription-payment">
    <h2 v-if="!showSuccess">Pago de Suscripción</h2>
    <div v-if="showSuccess" class="success-message">
      <h2>¡Suscripción comprada exitosamente!</h2>
      <p>Bienvenido a Custom Host. Tu suscripción está activa y ya puedes disfrutar de todos nuestros servicios.</p>
      <p>Serás redirigido al login en unos segundos...</p>
    </div>
    <div v-else>
      <div class="summary-card">
        <h3>{{ subscriptionPlan.name }}</h3>
        <ul>
          <li><strong>Habitaciones:</strong> {{ subscriptionPlan.maxRooms }}</li>
          <li><strong>Staff:</strong> {{ subscriptionPlan.maxStaffMembers }}</li>
          <li><strong>Dispositivos IoT:</strong> {{ subscriptionPlan.maxDevices }}</li>
        </ul>
        <p class="price">${{ subscriptionPlan.price }} / mes</p>
      </div>
      <form @submit.prevent="handleStripePayment" class="payment-form">
        <h4>Datos de la Tarjeta (Stripe)</h4>
        <div id="card-element" class="mb-4"></div>
        <div v-if="cardError" class="text-red-500 mb-2">{{ cardError }}</div>
        <pv-message severity="error" v-if="error">{{ error }}</pv-message>
        <pv-button type="submit" label="Confirmar y Pagar" :loading="processing" :disabled="processing" class="mt-3" />
      </form>
    </div>
  </div>
</template>

<style scoped>
.hotel-subscription-payment {
  max-width: 400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 2rem 1.5rem;
}
.summary-card {
  margin-bottom: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}
.summary-card ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem 0;
}
.summary-card li {
  margin-bottom: 0.3rem;
}
.price {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}
.payment-form {
  margin-top: 1.5rem;
}
.field {
  margin-bottom: 1rem;
}
.field-row {
  display: flex;
  gap: 1rem;
}
.success-message {
  text-align: center;
  padding: 2rem 1rem;
}
.success-message h2 {
  color: #43a047;
  margin-bottom: 1rem;
}
</style>
