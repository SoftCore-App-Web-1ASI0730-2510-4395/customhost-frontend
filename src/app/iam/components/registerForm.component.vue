@ -1,177 +0,0 @@
<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-registration']);

const username = ref('');
const email = ref('');
const password = ref('');
const passwordRepeat = ref('');
const submitted = ref(false);
const formErrorMessage = ref('');

function handleSubmit() {
  submitted.value = true;
  formErrorMessage.value = '';

  if (!username.value || !email.value || !password.value || !passwordRepeat.value) {
    return;
  }

  if (password.value !== passwordRepeat.value) {
    formErrorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  emit('submit-registration', {
    username: username.value,
    email: email.value,
    password: password.value
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <div class="field">
      <label for="usernameRegister" class="block">Nombre de usuario</label>
      <pv-input-text
          id="usernameRegister"
          v-model="username"
          :class="{'p-invalid': submitted && !username}"
          aria-describedby="usernameRegister-error"
          class="w-full"
          placeholder="Nombre de usuario"
      />
      <small id="usernameRegister-error" class="p-error" v-if="submitted && !username">El nombre de usuario es requerido.</small>
    </div>

    <div class="field mt-4">
      <label for="emailRegister" class="block">Email</label>
      <pv-input-text
          id="emailRegister"
          v-model="email"
          type="email"
          :class="{'p-invalid': submitted && !email}"
          aria-describedby="emailRegister-error"
          class="w-full"
          placeholder="Email"
      />
      <small id="emailRegister-error" class="p-error" v-if="submitted && !email">El email es requerido.</small>
    </div>

    <div class="field mt-4">
      <label for="passwordRegister" class="block">Contraseña</label>
      <pv-password
          id="passwordRegister"
          v-model="password"
          :class="{'p-invalid': submitted && !password}"
          :feedback="false"
          toggleMask
          aria-describedby="passwordRegister-error"
          class="w-full"
          placeholder="Contraseña"
      />
      <small id="passwordRegister-error" class="p-error" v-if="submitted && !password">La contraseña es requerida.</small>
    </div>

    <div class="field mt-4">
      <label for="passwordRepeatRegister" class="block">Repetir Contraseña</label>
      <pv-password
          id="passwordRepeatRegister"
          v-model="passwordRepeat"
          :class="{'p-invalid': (submitted && !passwordRepeat) || (submitted && password !== passwordRepeat && passwordRepeat)}"
          :feedback="false"
          toggleMask
          aria-describedby="passwordRepeatRegister-error"
          class="w-full"
          placeholder="Repetir Contraseña"
      />
      <small id="passwordRepeatRegister-error" class="p-error" v-if="submitted && !passwordRepeat">Por favor, repite la contraseña.</small>
      <small id="passwordMismatchRegister-error" class="p-error" v-if="submitted && password !== passwordRepeat && passwordRepeat">Las contraseñas no coinciden.</small>
    </div>

    <pv-message severity="error" v-if="formErrorMessage" class="mt-3">{{ formErrorMessage }}</pv-message>

    <div class="flex justify-content-end align-items-center mt-4">
      <pv-button
          type="submit"
          label="Registrarse"
          :loading="props.loading"
          :disabled="props.loading"
          class="register-button"
      />
    </div>

    <div class="text-center mt-4">
      <p>¿Ya tienes una cuenta? <router-link to="/iam/login">Inicia sesión aquí</router-link></p>
    </div>
  </form>
</template>

<style scoped>
/* Estilos específicos del formulario de registro */
.register-form {
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

.register-button {
  min-width: 120px;
}

/* Ajustes para el campo de contraseña pv-password */
.register-form .field :deep(.p-password.w-full) {
  display: flex;
}

.register-form .field :deep(.p-password.w-full .p-password-input) {
  flex-grow: 1;
}

.mt-3 {
  margin-top: 0.75rem;
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
.justify-content-end {
  justify-content: flex-end;
}
.align-items-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
</style>