<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GuestProfileRegister from '../../profiles/components/guest-profile-register.component.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-registration']);

const username = ref('');
const password = ref('');
const passwordRepeat = ref('');
const email = ref(''); // solo se usará para pasar a GuestProfileRegister
const submitted = ref(false);
const formErrorMessage = ref('');
const router = useRouter();
const showProfileForm = ref(false);

function handleSubmit() {
  submitted.value = true;
  formErrorMessage.value = '';

  if (!username.value || !password.value || !passwordRepeat.value) {
    formErrorMessage.value = 'Todos los campos son obligatorios.';
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
  // Aquí podrías hacer el registro real del usuario (API call)
  // Suponiendo que el registro fue exitoso, muestra el formulario de perfil
  showProfileForm.value = true;
}
</script>

<template>
  <div>
    <form v-if="!showProfileForm" @submit.prevent="handleSubmit" class="register-form">
      <div class="field mt-4">
        <label for="usernameRegister" class="block">Nombre de usuario</label>
        <pv-input-text
            id="usernameRegister"
            v-model="username"
            :class="{'p-invalid': submitted && !username}"
            aria-describedby="usernameRegister-error"
            class="w-full"
            placeholder="Ingresa tu nombre de usuario"
        />
        <small id="usernameRegister-error" class="p-error" v-if="submitted && !username">El nombre de usuario es requerido.</small>
      </div>
      <div class="field mt-4">
        <label for="passwordRegister" class="block">Contraseña</label>
        <pv-password
            id="passwordRegister"
            v-model="password"
            :class="{'p-invalid': submitted && !password}"
            aria-describedby="passwordRegister-error"
            class="w-full"
            placeholder="Ingresa tu contraseña"
            toggleMask
            :feedback="false"
        />
        <small id="passwordRegister-error" class="p-error" v-if="submitted && !password">La contraseña es requerida.</small>
      </div>
      <div class="field mt-4">
        <label for="passwordRepeatRegister" class="block">Confirmar contraseña</label>
        <pv-password
            id="passwordRepeatRegister"
            v-model="passwordRepeat"
            :class="{'p-invalid': submitted && !passwordRepeat}"
            aria-describedby="passwordRepeatRegister-error"
            class="w-full"
            placeholder="Confirma tu contraseña"
            toggleMask
            :feedback="false"
        />
        <small id="passwordRepeatRegister-error" class="p-error" v-if="submitted && !passwordRepeat">La confirmación de contraseña es requerida.</small>
      </div>
      <pv-message severity="error" v-if="formErrorMessage" class="mt-3">{{ formErrorMessage }}</pv-message>
      <div class="button-container mt-4">
        <pv-button
            type="submit"
            label="Registrarse como Usuario"
            class="w-full register-button"
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
          ¿Eres un hotel?
          <router-link to="/iam/register-hotel" class="hotel-link">Regístrate como hotel</router-link>
        </p>
      </div>
    </form>
    <GuestProfileRegister v-else :username="username" :password="password" />
  </div>
</template>

<style scoped>
.register-form {
  width: 100%;
}

.field {
  margin-bottom: 1rem;
}

.button-container {
  margin-top: 1.5rem;
}

.register-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-link-container,
.alternative-registration {
  text-align: center;
}

.login-link,
.hotel-link {
  color: var(--p-primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover,
.hotel-link:hover {
  color: var(--p-primary-600);
  text-decoration: underline;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .register-form {
    padding: 0 0.5rem;
  }
}
</style>
