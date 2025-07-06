@ -1,127 +0,0 @@
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Card, Toast, Message } from "primevue";
import LoginForm from '../components/loginForm.component.vue';
import { useAuth } from '../../shared/composables/useAuth.js';

const errorMessage = ref('');
const router = useRouter();
const { login, isLoading } = useAuth();

async function handleLogin(formData) {
  errorMessage.value = '';

  try {
    const response = await login(formData);
    
    // Redirigir según el rol del usuario
    const userRole = response.role;
    if (userRole === 'ADMIN' || userRole === 'STAFF') {
      router.push('/staff-home');
    } else {
      router.push('/guest-home');
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

<template>
  <div class="login-container">
    <pv-card class="login-card">
      <template #title>
        <h2 class="login-title">Iniciar sesión</h2>
      </template>
      <template #content>
        <div class="login-form-content">
          <LoginForm
            :loading="isLoading"
            @submit-login="handleLogin"
          />
          <pv-message severity="error" v-if="errorMessage && !isLoading" class="mt-3 page-error-message">{{ errorMessage }}</pv-message>
        </div>
      </template>
    </pv-card>
    <pv-toast position="top-right" />
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f4f6f8;
  flex-direction: column;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(34, 197, 94, 0.10);
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #22c55e;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.login-form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-error-message {
  margin-top: 1rem;
  width: 100%;
  text-align: center;
}
</style>