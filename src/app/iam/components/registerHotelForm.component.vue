<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-registration']);

const hotelName = ref('');
const username = ref('');
const password = ref('');
const passwordRepeat = ref('');
const submitted = ref(false);
const formErrorMessage = ref('');

function handleSubmit() {
  submitted.value = true;
  formErrorMessage.value = '';

  if (!hotelName.value || !username.value || !password.value || !passwordRepeat.value) {
    return;
  }

  if (password.value !== passwordRepeat.value) {
    formErrorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  if (password.value.length < 6) {
    formErrorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  emit('submit-registration', {
    hotelName: hotelName.value,
    username: username.value,
    password: password.value
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="register-hotel-form">
    <div class="field">
      <label for="hotelNameForm" class="block">Nombre del Hotel</label>
      <pv-input-text
          id="hotelNameForm"
          v-model="hotelName"
          :class="{'p-invalid': submitted && !hotelName}"
          aria-describedby="hotelNameForm-error"
          class="w-full"
          placeholder="Ingresa el nombre del hotel"
      />
      <small id="hotelNameForm-error" class="p-error" v-if="submitted && !hotelName">El nombre del hotel es requerido.</small>
    </div>

    <div class="field mt-4">
      <label for="usernameHotelForm" class="block">Nombre de usuario</label>
      <pv-input-text
          id="usernameHotelForm"
          v-model="username"
          :class="{'p-invalid': submitted && !username}"
          aria-describedby="usernameHotelForm-error"
          class="w-full"
          placeholder="Ingresa el nombre de usuario del administrador"
      />
      <small id="usernameHotelForm-error" class="p-error" v-if="submitted && !username">El nombre de usuario es requerido.</small>
    </div>

    <div class="field mt-4">
      <label for="passwordHotelForm" class="block">Contraseña</label>
      <pv-password
          id="passwordHotelForm"
          v-model="password"
          :class="{'p-invalid': submitted && !password}"
          aria-describedby="passwordHotelForm-error"
          class="w-full"
          placeholder="Ingresa la contraseña"
          toggleMask
          :feedback="false"
      />
      <small id="passwordHotelForm-error" class="p-error" v-if="submitted && !password">La contraseña es requerida.</small>
    </div>

    <div class="field mt-4">
      <label for="passwordRepeatHotelForm" class="block">Confirmar contraseña</label>
      <pv-password
          id="passwordRepeatHotelForm"
          v-model="passwordRepeat"
          :class="{'p-invalid': submitted && !passwordRepeat}"
          aria-describedby="passwordRepeatHotelForm-error"
          class="w-full"
          placeholder="Confirma la contraseña"
          toggleMask
          :feedback="false"
      />
      <small id="passwordRepeatHotelForm-error" class="p-error" v-if="submitted && !passwordRepeat">La confirmación de contraseña es requerida.</small>
    </div>

    <pv-message severity="error" v-if="formErrorMessage" class="mt-3">{{ formErrorMessage }}</pv-message>

    <div class="button-container mt-4">
      <pv-button
          type="submit"
          label="Registrar Hotel"
          class="w-full register-hotel-button"
          :loading="loading"
          :disabled="loading"
      />
    </div>

    <div class="login-link-container mt-4">
      <p class="text-center">
        ¿Ya tienes una cuenta?
        <router-link to="/iam/login" class="login-link">Iniciar sesión</router-link>
      </p>
    </div>

    <div class="alternative-registration mt-3">
      <p class="text-center">
        ¿Eres un usuario común?
        <router-link to="/iam/register" class="user-link">Regístrate como usuario</router-link>
      </p>
    </div>
  </form>
</template>

<style scoped>
.register-hotel-form {
  width: 100%;
}

.field {
  margin-bottom: 1rem;
}

.button-container {
  margin-top: 1.5rem;
}

.register-hotel-button {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.register-hotel-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.login-link-container,
.alternative-registration {
  text-align: center;
}

.login-link,
.user-link {
  color: var(--p-primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover,
.user-link:hover {
  color: var(--p-primary-600);
  text-decoration: underline;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .register-hotel-form {
    padding: 0 0.5rem;
  }
}
</style>