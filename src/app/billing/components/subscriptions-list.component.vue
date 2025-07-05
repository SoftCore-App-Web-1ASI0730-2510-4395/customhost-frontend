<script setup>
import { ref, onMounted } from 'vue';
import { getSubscriptionPlans } from '../services/subscription-plan.service.js';

const subscriptions = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    subscriptions.value = await getSubscriptionPlans();
  } catch (err) {
    error.value = 'No se pudieron cargar los planes de suscripción.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const emit = defineEmits(['select-subscription']);

function selectSubscription(subscription) {
  emit('select-subscription', subscription);
}
</script>

<template>
  <div class="subscriptions-list">
    <h2>Elige una suscripción</h2>
    <div class="subscriptions-container">
      <div v-for="sub in subscriptions" :key="sub.id" class="subscription-card">
        <h3>{{ sub.name }}</h3>
        <ul class="features-list">
          <li><strong>Habitaciones:</strong> {{ sub.maxRooms }}</li>
          <li><strong>Staff:</strong> {{ sub.maxStaffMembers }}</li>
          <li><strong>Dispositivos IoT:</strong> {{ sub.maxDevices }}</li>
        </ul>
        <p class="price">${{ sub.price }} / mes</p>
        <pv-button label="Seleccionar" @click="selectSubscription(sub)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscriptions-list {
  text-align: center;
}
.subscriptions-container {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}
.subscription-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 2rem 1.5rem;
  min-width: 220px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.price {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
}
.features-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0.5rem 0;
  text-align: left;
}
.features-list li {
  margin-bottom: 0.3rem;
  font-size: 0.98rem;
}
</style>
