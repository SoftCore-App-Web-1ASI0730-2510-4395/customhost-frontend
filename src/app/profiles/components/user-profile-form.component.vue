<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Nombre:</label>
      <input v-model="form.firstName" required />
    </div>
    <div>
      <label>Apellido:</label>
      <input v-model="form.lastName" required />
    </div>
    <div>
      <label>Email:</label>
      <input v-model="form.email" type="email" required />
    </div>
    <div>
      <label>Teléfono:</label>
      <input v-model="form.phone" required />
    </div>
    <button type="submit">Crear Perfil</button>
    <div v-if="error" style="color:red">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { createProfile } from '../services/profile.service.js';
import apiClient from '../../shared/services/api-service.js';

const props = defineProps({
  password: { type: String, required: true }
});

const emit = defineEmits(['profile-created']);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  try {
    // Obtener el último hotel creado
    const hotelsRes = await apiClient.get('/api/v1/hotel');
    const hotels = hotelsRes.data;
    const lastHotel = hotels[hotels.length - 1];
    // Preparar datos para el perfil
    const profileData = {
      hotelId: lastHotel.id,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      password: props.password, // Usar la constante
      Role: 'ADMIN'
    };
    console.log('profileData enviado:', profileData);
    await createProfile(profileData);
    emit('profile-created'); // Avanza al componente de suscripciones
    // alert('Perfil creado correctamente');
  } catch (e) {
    console.error('Error backend:', e?.response?.data || e);
    if (e?.response?.data?.errors) {
      console.error('Errores de validación:', e.response.data.errors);
      error.value = 'Errores de validación: ' + JSON.stringify(e.response.data.errors);
    } else {
      error.value = 'Error al crear el perfil: ' + (e?.response?.data?.message || '');
    }
  }
};
</script>
