<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GuestProfileRegister from '../../profiles/components/guest-profile-register.component.vue';
import LanguageSwitcher from '../../public/components/languageSwitcher.component.vue';

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
  <div class="register-form-wrapper">
    <div class="register-lang-switcher">
      <language-switcher />
    </div>
    <h1 class="main-title">Crear cuenta</h1>
    <h2 class="subtitle">¡Bienvenido a CustomHost!</h2>
    <p class="description">Crea tu cuenta para acceder a todos los beneficios de nuestra plataforma.</p>
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
        <label for="passwordRegister" class="block label-large">Ingresa tu contraseña</label>
        <pv-password
            id="passwordRegister"
            v-model="password"
            :class="['input-large', {'p-invalid': submitted && !password}]"
            aria-describedby="passwordRegister-error password-security-info"
            class="w-full"
            placeholder="Ingresa tu contraseña"
            toggleMask
            :feedback="true"
        />
        <small id="passwordRegister-error" class="p-error" v-if="submitted && !password">La contraseña es requerida.</small>
      </div>
      <div class="field mt-4">
        <label for="passwordRepeatRegister" class="block label-large">Confirma tu contraseña</label>
        <pv-password
            id="passwordRepeatRegister"
            v-model="passwordRepeat"
            :class="['input-large', {'p-invalid': submitted && !passwordRepeat}]"
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
      <div class="mt-3 text-xs text-center text-gray-500">
        Al registrarte, aceptas nuestros <a href="#" class="text-primary">Términos de uso</a> y <a href="#" class="text-primary">Política de privacidad</a>.
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
.register-form-wrapper {
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(34, 197, 94, 0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}
.register-lang-switcher {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.main-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #22c55e;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}
.subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #166534;
  text-align: center;
  margin-bottom: 0.2rem;
}
.description {
  text-align: center;
  color: #6b7280;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}
.register-form {
  width: 100%;
}
.field {
  margin-bottom: 1.5rem;
}
.label-large {
  font-size: 1.18rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 0.4rem;
  letter-spacing: 0.5px;
}
.input-large {
  font-size: 1.25rem !important;
  padding: 1rem 1.2rem !important;
  border-radius: 10px !important;
  border: 1.5px solid #bbf7d0 !important;
  background: #f8fafc !important;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.07);
  transition: border 0.2s, box-shadow 0.2s;
}
.input-large:focus {
  border: 1.5px solid #22c55e !important;
  box-shadow: 0 0 0 2px #bbf7d088;
}
.p-password input.input-large {
  font-size: 1.25rem !important;
  padding: 1rem 2.5rem 1rem 1.2rem !important;
}
.p-password .p-password-icon {
  right: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: #22c55e;
}
.p-password {
  width: 100%;
}
.p-error {
  font-size: 0.98rem;
  margin-top: 0.2rem;
}
.button-container {
  margin-top: 1.5rem;
}
.register-button {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
  border: none;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.13);
  color: #fff;
}
.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.18);
}
.login-link-container,
.alternative-registration {
  text-align: center;
}
.login-link,
.hotel-link {
  color: #22c55e;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}
.login-link:hover,
.hotel-link:hover {
  color: #166534;
  text-decoration: underline;
}
@media screen and (max-width: 768px) {
  .register-form-wrapper {
    padding: 1.2rem 0.5rem 1.5rem 0.5rem;
    margin-top: 1.2rem;
  }
}
</style>
