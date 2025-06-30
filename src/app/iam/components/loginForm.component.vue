@ -1,157 +0,0 @@
<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-login']);

const email = ref('');
const password = ref('');
const submitted = ref(false);

function handleSubmit() {
  submitted.value = true;

  if (!email.value || !password.value) {
    return;
  }

  emit('submit-login', {
    email: email.value,
    password: password.value
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <div class="field">
      <label for="emailLogin" class="block">Email</label>
      <pv-input-text
          id="emailLogin"
          v-model="email"
          :class="{'p-invalid': submitted && !email}"
          aria-describedby="emailLogin-error"
          class="w-full"
          placeholder="Email"
      />
      <small id="emailLogin-error" class="p-error" v-if="submitted && !email">El email es requerido.</small>
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

    <div class="text-center mt-4">
      <p>¿No tienes una cuenta? <router-link to="/iam/register">Regístrate aquí</router-link></p>
    </div>
  </form>
</template>

<style scoped>
/* Estilos específicos del formulario de login */
.login-form {
  padding: 1rem 0;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.p-error {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.

.forgot-password {
  color: var( #64748b);
  font-size: 0.9rem;
  text-decoration: none;
}

.login-button {
  min-width: 120px;
}

/* Ajustes para el campo de contraseña pv-password */
.login-form .field :deep(.p-password.w-full) {
  display: flex;
}

.login-form .field :deep(.p-password.w-full .p-password-input) {
  flex-grow: 1;
}

.mt-4 {
  margin-top: 1rem;
}
.w-full {
  width: 100%;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
.mt-4 {
  margin-top: 1rem;
}
.w-full {
  width: 100%;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
</style>