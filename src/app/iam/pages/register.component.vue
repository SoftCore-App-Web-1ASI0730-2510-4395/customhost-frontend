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
    <div class="login-container">
      <div class="login-image-container">
        <img src="/src/assets/img/auth_img.jpg" alt="Register Background" class="login-image" />
      </div>
      <div class="login-form-container">
        <div class="register-container">
          <pv-card class="login-card">
            <template #title>
            </template>
            <template #content>
              <RegisterForm
                  :loading="isLoading"
                  @submit-registration="handleRegistration"
              />
              <!-- Mensaje de error general para la página -->
              <pv-message severity="error" v-if="errorMessage && !isLoading" class="mt-3 page-error-message">{{ errorMessage }}</pv-message>
            </template>
          </pv-card>
          <pv-toast position="top-right" />
        </div>
      </div>
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
.no-image-header .login-image-container {
  display: none !important;
}
/* Estilos copiados de login.component.vue para consistencia visual */
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
  max-width: 450px; /* Ajustado para más campos */
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 1.8rem;
  /* color: var(--color-primary, #4f46e5); */ /* Comentado como en login */
  margin-bottom: 0.5rem;
}

/* Estilos específicos del formulario se movieron a registerForm.component.vue */

.register-container {
  max-width: 430px;
  margin: 2.5rem auto 2.5rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(34, 197, 94, 0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.register-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #22c55e;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}
.register-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #166534;
  text-align: center;
  margin-bottom: 0.2rem;
}
.register-description {
  text-align: center;
  color: #6b7280;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}
.page-error-message {
  margin-top: 1rem;
  color: #ef4444;
  text-align: center;
  font-weight: 600;
}

/* Media query para pantallas más grandes */
@media screen and (min-width: 768px) {
  .login-container {
    flex-direction: row;
  }

  .login-image-container {
    display: block;
    max-width: 50%; /* Ajustado para que la imagen no sea demasiado dominante */
  }

  .login-form-container {
    max-width: 50%; /* Ajustado para el formulario */
  }
  .login-card {
    max-width: 500px; /* Un poco más de espacio para los campos adicionales */
  }
}

/* Para pantallas muy grandes, limitamos el tamaño del formulario */
@media screen and (min-width: 1200px) {
  .login-card {
    max-width: 550px; /* Aún más espacio si es necesario */
  }
}
</style>