<template>
  <form @submit.prevent="handleSubmit" class="profile-register-container">
    <h2 class="font-bold text-2xl mb-3 flex align-items-center gap-2">
      <i class="pi pi-user-plus text-primary-600" /> {{$t('guestProfileRegister.title')}}
    </h2>
    <div class="form-group">
      <label for="firstName">{{$t('guestProfileRegister.firstName')}}</label>
      <input v-model="form.firstName" id="firstName" required />
    </div>
    <div class="form-group">
      <label for="lastName">{{$t('guestProfileRegister.lastName')}}</label>
      <input v-model="form.lastName" id="lastName" required />
    </div>
    <div class="form-group">
      <label for="email">{{$t('guestProfileRegister.email')}}</label>
      <input v-model="form.email" id="email" type="email" required />
    </div>
    <div class="form-group">
      <label for="phone">{{$t('guestProfileRegister.phone')}}</label>
      <input v-model="form.phone" id="phone" required />
    </div>
    <input type="hidden" v-model="form.userId" />
    <button type="submit" :disabled="loading" class="p-button p-component w-full mt-3">
      <span class="pi pi-check-circle mr-2" />{{$t('guestProfileRegister.submit')}}
    </button>
    <div v-if="error" class="error-msg mt-2">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '../../shared/services/api-service.js';
import authService from '../../iam/services/auth.service.js';

const props = defineProps({
  password: { type: String, required: true },
  username: String
});

const emit = defineEmits(['profile-created']);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  userId: null
});
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    // 1. Registrar usuario (signUp)
    await authService.signUpUser({
      username: props.username || form.value.username || form.value.email, // Prioriza username si está disponible
      password: props.password
    });
    // 2. Login automático tras registro
    await authService.signIn({
      username: props.username || form.value.username || form.value.email, // Prioriza username si está disponible
      password: props.password
    });
    // 3. Crear perfil con token ya guardado
    // Obtener userId del usuario autenticado
    let userId = null;
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        userId = parsed.id;
        form.value.userId = userId;
      } catch (e) {
        console.error('No se pudo parsear userData para userId:', e);
      }
    }
    const profileData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      role: 'GUEST',
      hotelId: null,
      password: props.password,
      userId: form.value.userId // Asigna el userId del usuario autenticado
    };
    console.log('profileData enviado:', profileData);
    await apiClient.post('/api/v1/profiles', profileData);
    // Mensaje de éxito y redirección a login
    alert('¡Perfil creado exitosamente! Ahora puedes iniciar sesión.');
    window.location.href = '/iam/login'; // Redirige a login.component.vue
    // Puedes emitir evento o redirigir aquí
    // emit('profile-created');
  } catch (e) {
    console.error('Error backend:', e?.response?.data || e);
    if (e?.response?.data?.errors) {
      error.value = 'Errores de validación: ' + JSON.stringify(e.response.data.errors);
    } else {
      error.value = 'Error: ' + (e?.response?.data?.message || e.message || '');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import 'primeflex/primeflex.css';
@import 'primeicons/primeicons.css';

.profile-register-container {
  width: 100%;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}
label {
  font-weight: 600;
  margin-bottom: 0.3rem;
}
input {
  padding: 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid #bdbdbd;
}
button.p-button {
  background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
button.p-button:disabled {
  background: #90caf9;
  cursor: not-allowed;
}
.error-msg {
  color: #f44336;
  margin-top: 0.5rem;
  text-align: center;
}
</style>
