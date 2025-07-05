<script setup>
import { ref, onMounted } from 'vue';

// Simulación de suscripciones, puedes reemplazar por fetch real
const subscriptions = ref([
  { id: 1, name: 'Básica', price: 10, description: 'Ideal para hoteles pequeños.' },
  { id: 2, name: 'Pro', price: 25, description: 'Para hoteles medianos con más necesidades.' },
  { id: 3, name: 'Premium', price: 50, description: 'Para hoteles grandes y con demanda alta.' }
]);

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
        <p>{{ sub.description }}</p>
        <p class="price">${{ sub.price }}/mes</p>
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
</style>

