@ -1,127 +0,0 @@
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Card, Toast, Message } from "primevue";
import LoginForm from '../components/loginForm.component.vue';

const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();

function handleLogin(formData) {
  errorMessage.value = '';
  loading.value = true;

  // Aquí implementarías la lógica de autenticación
  console.log("Datos recibidos del formulario:", formData);

  setTimeout(() => {
    if (formData.email === 'usuario@ejemplo.com' && formData.password === 'contraseña') {
      // Login exitoso
      router.push('/');
    } else {
      // Login fallido
      errorMessage.value = 'Credenciales incorrectas';
    }
    loading.value = false;
  }, 1000);
}
</script>

<template>
  <div class="login-container">
    <div class="login-image-container">
      <img src="/src/assets/img/auth_img.jpg" alt="Login Background" class="login-image" />
    </div>
    <div class="login-form-container">
      <pv-card class="login-card">
        <template #title>
          <h2 class="login-title">Iniciar sesión</h2>
        </template>
        <template #content>
          <LoginForm
              :loading="loading"
              @submit-login="handleLogin"
          />
          <pv-message severity="error" v-if="errorMessage && !loading" class="mt-3 page-error-message">{{ errorMessage }}</pv-message>
        </template>
      </pv-card>
      <pv-toast position="top-right" />
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

.login-image-container {
  flex: 1;
  display: none;
  overflow: hidden;
  max-height: 100vh;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.login-form-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 1.8rem;
  /* color: var(--color-primary, #4f46e5); */
  margin-bottom: 0.5rem;
}

/* Estilos específicos del formulario se movieron a loginForm.component.vue */

/* Media query para pantallas más grandes */
@media screen and (min-width: 768px) {
  .login-container {
    flex-direction: row;
  }

  .login-image-container {
    display: block;
    max-width: 50%;
  }

  .login-form-container {
    max-width: 50%;
  }
}

/* Para pantallas muy grandes, limitamos el tamaño del formulario */
@media screen and (min-width: 1200px) {
  .login-card {
    max-width: 500px;
  }
}

.page-error-message {
  margin-top: 1rem;
}
</style>