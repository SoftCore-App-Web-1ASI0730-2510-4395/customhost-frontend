<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Card, Toast, Message } from "primevue";
import RegisterForm from '../components/registerForm.component.vue';
import { useAuth } from '../../shared/composables/useAuth.js';

const errorMessage = ref('');
const router = useRouter();
const toast = useToast();
const { registerUser, isLoading } = useAuth();

async function handleRegistration(formData) {
  errorMessage.value = '';

  try {
    await registerUser(formData);
    
    toast.add({
      severity: 'success', 
      summary: 'Registro Exitoso', 
      detail: 'Cuenta creada correctamente. Ahora puedes iniciar sesión.',
      life: 5000
    });
    
    // Redirigir al login después del registro exitoso
    setTimeout(() => {
      router.push('/iam/login');
    }, 2000);
    
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

<template>
  <div>
    <div class="sticky-header-simple">
      <div class="flex gap-3 justify-content-center align-items-center py-3 px-4" style="background: var(--color-secondary); color: var(--color-primary-light);">
        <span class="font-semibold text-2xl">Custom Host</span>
        <language-switcher />
      </div>
    </div>
    <div class="register-outer-center">
      <pv-card class="register-card">
        <template #title>
          <h2 class="register-title">Registro</h2>
        </template>
        <template #content>
          <div class="register-form-content">
            <RegisterForm
                :loading="isLoading"
                @submit-registration="handleRegistration"
            />
            <pv-message severity="error" v-if="errorMessage && !isLoading" class="mt-3 page-error-message">{{ errorMessage }}</pv-message>
          </div>
        </template>
      </pv-card>
      <pv-toast position="top-center" />
    </div>
  </div>
</template>

<style scoped>
.sticky-header-simple {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
body, .app-layout, #app {
  padding-top: 64px !important;
}
span {
  font-family: "Anta", sans-serif;
  letter-spacing: max(1px, 0.1vw);
}

.register-outer-center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f8;
  flex-direction: column;
  padding-top: 64px;
}

.register-card {
  width: 100%;
  max-width: 430px;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(34, 197, 94, 0.13);
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #22c55e;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.register-form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-error-message {
  margin-top: 1rem;
  color: #ef4444;
  text-align: center;
  font-weight: 600;
  width: 100%;
}
</style>