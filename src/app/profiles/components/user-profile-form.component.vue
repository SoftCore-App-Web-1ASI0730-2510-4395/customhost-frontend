<template>
  <form @submit.prevent="handleSubmit" class="user-profile-form-wrapper">
    <div>
      <label class="user-profile-label">Nombre:</label>
      <input v-model="form.firstName" required class="user-profile-input" />
    </div>
    <div>
      <label class="user-profile-label">Apellido:</label>
      <input v-model="form.lastName" required class="user-profile-input" />
    </div>
    <div>
      <label class="user-profile-label">Email:</label>
      <input v-model="form.email" type="email" required class="user-profile-input" />
    </div>
    <div>
      <label class="user-profile-label">Teléfono:</label>
      <input v-model="form.phone" required class="user-profile-input" />
    </div>
    <button type="submit" class="user-profile-btn">Crear Perfil</button>
    <div v-if="error" style="color:red">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { createProfile } from '../services/profile.service.js';
import apiClient from '../../shared/services/api-service.js';

const props = defineProps({
  password: { type: String, required: true },
  userId: { type: [String, Number], required: false }
});

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  userId: null
});

// Obtener userId del localStorage si existe
const storedUser = localStorage.getItem('user');
if (storedUser) {
  try {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.id) {
      form.value.userId = parsedUser.id;
    }
  } catch (e) {
    // Si hay error al parsear, no hacer nada
  }
}

// Si no hay userId, obtener el último id de /api/v1/users
if (!form.value.userId) {
  apiClient.get('/api/v1/users').then(res => {
    const users = res.data;
    if (Array.isArray(users) && users.length > 0) {
      const lastUser = users[users.length - 1];
      if (lastUser && lastUser.id) {
        form.value.userId = lastUser.id;
      }
    }
  }).catch(() => {
    // Si hay error, no hacer nada
  });
}

const emit = defineEmits(['profile-created']);

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
      Role: 'ADMIN',
      userId: props.userId || form.value.userId // Asegura que se envía el userId
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

<style scoped>
.user-profile-form-wrapper {
  max-width: 420px;
  margin: 2.5rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(34, 197, 94, 0.13);
  padding: 2.2rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.user-profile-title {
  font-size: 2rem;
  font-weight: 800;
  color: #22c55e;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}
.user-profile-label {
  font-size: 1.13rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 0.4rem;
  letter-spacing: 0.5px;
  display: block;
}
.user-profile-input {
  font-size: 1.18rem !important;
  padding: 1rem 1.2rem !important;
  border-radius: 10px !important;
  border: 1.5px solid #bbf7d0 !important;
  background: #f8fafc !important;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.07);
  margin-bottom: 0.2rem;
  transition: border 0.2s, box-shadow 0.2s;
}
.user-profile-input:focus {
  border: 1.5px solid #22c55e !important;
  box-shadow: 0 0 0 2px #bbf7d088;
}
.user-profile-btn {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
  border: none;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.13);
  color: #fff;
  margin-top: 1.2rem;
}
.user-profile-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.18);
}
@media screen and (max-width: 600px) {
  .user-profile-form-wrapper {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    margin-top: 1.2rem;
  }
}
</style>
