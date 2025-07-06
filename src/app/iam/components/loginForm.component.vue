<script setup>
import { ref } from 'vue';
import LanguageSwitcher from '../../public/components/languageSwitcher.component.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-login']);

const username = ref('');
const password = ref('');
const submitted = ref(false);

function handleSubmit() {
  submitted.value = true;

  if (!username.value || !password.value) {
    return;
  }

  emit('submit-login', {
    username: username.value,
    password: password.value
  });
}

function goToRegister() {
  // Redirige usando el router para evitar problemas de navegación
  window.location.href = '/iam/register';
}
</script>

<template>
  <div class="login-form-wrapper">
    <div class="login-lang-switcher">
      <language-switcher />
    </div>

    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="field">
        <label for="usernameLogin" class="block">Usuario</label>
        <pv-input-text
            id="usernameLogin"
            v-model="username"
            :class="{'p-invalid': submitted && !username}"
            aria-describedby="usernameLogin-error"
            class="w-full"
            placeholder="Usuario"
        />
        <small id="usernameLogin-error" class="p-error" v-if="submitted && !username">El usuario es requerido.</small>
      </div>

      <div class="field mt-4">
        <label for="passwordLogin" class="block">Contraseña</label>
        <pv-password
            id="passwordLogin"
            v-model="password"
            :class="{'p-invalid': submitted && !password}"
            :feedback="false"
            toggleMask
            aria-describedby="passwordLogin-error"
            class="w-full"
            placeholder="Contraseña"
        />
        <small id="passwordLogin-error" class="p-error" v-if="submitted && !password">La contraseña es requerida.</small>
      </div>

      <div class="flex justify-content-between align-items-center mt-4">
        <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
        <pv-button
            type="submit"
            label="Iniciar sesión"
            :loading="props.loading"
            :disabled="props.loading"
            class="login-button"
        />
      </div>

      <div class="mt-4 text-center">
        <router-link to="/iam/register" class="register-link" @click.prevent="goToRegister">
          ¿No tienes cuenta? Regístrate aquí
        </router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Estilos específicos del formulario de login */
.login-form-wrapper {
  max-width: 410px;
  margin: 2.5rem auto 1.5rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(34, 197, 94, 0.10);
  padding: 1.5rem 2rem 1rem 2rem;
  position: relative;
}

.login-lang-switcher {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.login-form {
  padding: 1.5rem 0 0.5rem 0;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(34, 197, 94, 0.10);
  max-width: 410px;
  margin: 2.5rem auto 1.5rem auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: #22c55e;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.login-description {
  text-align: center;
  color: #6b7280;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #166534;
  font-size: 1.13rem;
  letter-spacing: 0.5px;
}

.p-error {
  font-size: 0.98rem;
  margin-top: 0.2rem;
}

.forgot-password {
  color: #22c55e;
  font-size: 0.95rem;
  text-decoration: none;
  font-weight: 600;
}

.login-input, .p-password input.login-input {
  font-size: 1.18rem !important;
  padding: 1rem 1.2rem !important;
  border-radius: 10px !important;
  border: 1.5px solid #bbf7d0 !important;
  background: #f8fafc !important;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.07);
  transition: border 0.2s, box-shadow 0.2s;
}
.login-input:focus, .p-password input.login-input:focus {
  border: 1.5px solid #22c55e !important;
  box-shadow: 0 0 0 2px #bbf7d088;
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
.button-container {
  margin-top: 1.5rem;
}
.login-button {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
  border: none;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.13);
  color: #fff;
  margin-bottom: 0.5rem;
}
.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.18);
}
.registrate-aqui {
  display: block;
  text-align: center;
  margin-top: 0.5rem;
  color: #22c55e;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: underline;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: color 0.2s;
}
.registrate-aqui:hover {
  color: #166534;
}
@media screen and (max-width: 768px) {
  .login-form {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    margin-top: 1.2rem;
  }
}
</style>