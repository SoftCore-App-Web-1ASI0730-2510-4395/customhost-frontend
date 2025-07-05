<script setup>
import { ref } from 'vue';
import { createHotel } from '../../crm/services/hotels.service.js';

const props = defineProps({
  hotel: {
    type: Object,
    required: true
  }
});

const address = ref(props.hotel.address || '');
const phone = ref(props.hotel.phone || '');
const email = ref(props.hotel.email || '');

const emit = defineEmits(['save-details']);

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function handleSave() {
  console.log('[EditHotelDetails] Datos a guardar:', {
    name: props.hotel.name,
    address: address.value,
    phone: phone.value,
    email: email.value
  });
  errorMessage.value = '';
  successMessage.value = '';
  if (!props.hotel.name || !address.value || !phone.value || !email.value) {
    errorMessage.value = 'Todos los campos son obligatorios.';
    return;
  }
  loading.value = true;
  try {
    const hotelData = {
      name: props.hotel.name,
      address: address.value,
      phone: phone.value,
      email: email.value
    };
    await createHotel(hotelData);
    successMessage.value = 'Datos del hotel guardados correctamente.';
    emit('save-details', hotelData);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al guardar los datos del hotel.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="edit-hotel-details-card">
    <h2>Completa los datos de tu hotel</h2>
    <div class="field">
      <label>Dirección</label>
      <pv-input-text v-model="address" placeholder="Dirección del hotel" />
    </div>
    <div class="field">
      <label>Teléfono</label>
      <pv-input-text v-model="phone" placeholder="Teléfono del hotel" />
    </div>
    <div class="field">
      <label>Email</label>
      <pv-input-text v-model="email" placeholder="Email del hotel" />
    </div>
    <pv-message severity="error" v-if="errorMessage">{{ errorMessage }}</pv-message>
    <pv-message severity="success" v-if="successMessage">{{ successMessage }}</pv-message>
    <pv-button label="Guardar" @click="handleSave" class="mt-4" :loading="loading" :disabled="loading" />
  </div>
</template>

<style scoped>
.edit-hotel-details-card {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  max-width: 400px;
  margin: 0 auto;
}
.field {
  margin-bottom: 1.5rem;
}
</style>
