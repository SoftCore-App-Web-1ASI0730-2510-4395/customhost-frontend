<script setup>
import { ref } from 'vue';
import { createHotel } from '../../crm/services/hotels.service.js';
import LanguageSwitcher from '../../public/components/languageSwitcher.component.vue';

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
    <div class="edit-hotel-lang-switcher">
      <language-switcher />
    </div>
    <h2 class="edit-hotel-title">Completa los datos de tu hotel</h2>
    <div class="field">
      <label class="edit-hotel-label">Dirección</label>
      <pv-input-text v-model="address" placeholder="Dirección del hotel" class="edit-hotel-input" />
    </div>
    <div class="field">
      <label class="edit-hotel-label">Teléfono</label>
      <pv-input-text v-model="phone" placeholder="Teléfono del hotel" class="edit-hotel-input" />
    </div>
    <div class="field">
      <label class="edit-hotel-label">Email</label>
      <pv-input-text v-model="email" placeholder="Email del hotel" class="edit-hotel-input" />
    </div>
    <div class="edit-hotel-actions">
      <pv-button :loading="loading" label="Guardar" class="edit-hotel-btn" @click="handleSave" />
    </div>
    <p v-if="successMessage" class="edit-hotel-success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="edit-hotel-error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.edit-hotel-details-card {
  max-width: 420px;
  margin: 2.5rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 32px 0 rgba(34, 197, 94, 0.13);
  padding: 2.2rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.edit-hotel-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: #22c55e;
  text-align: center;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
}
.edit-hotel-label {
  font-size: 1.08rem;
  font-weight: 600;
  color: #166534;
  margin-bottom: 0.3rem;
  display: block;
}
.edit-hotel-input {
  font-size: 1.13rem !important;
  padding: 0.9rem 1.1rem !important;
  border-radius: 9px !important;
  border: 1.5px solid #bbf7d0 !important;
  background: #f8fafc !important;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.07);
  margin-bottom: 0.2rem;
  transition: border 0.2s, box-shadow 0.2s;
}
.edit-hotel-input:focus {
  border: 1.5px solid #22c55e !important;
  box-shadow: 0 0 0 2px #bbf7d088;
}
.edit-hotel-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.2rem;
}
.edit-hotel-btn {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
  border: none;
  padding: 0.85rem 2.2rem;
  font-weight: 700;
  font-size: 1.08rem;
  border-radius: 8px;
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.13);
}
.edit-hotel-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.18);
}
.edit-hotel-success {
  color: #22c55e;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}
.edit-hotel-error {
  color: #ef4444;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}
.edit-hotel-lang-switcher {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
@media screen and (max-width: 600px) {
  .edit-hotel-details-card {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    margin-top: 1.2rem;
  }
}
</style>
