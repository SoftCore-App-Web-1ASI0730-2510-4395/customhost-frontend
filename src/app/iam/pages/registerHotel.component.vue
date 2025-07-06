<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Card, Toast, Message } from "primevue";
import RegisterHotelForm from '../components/registerHotelForm.component.vue';
import EditHotelDetails from '../components/EditHotelDetails.vue';
import { useAuth } from '../../shared/composables/useAuth.js';
import AuthService from '../services/auth.service.js';
import SubscriptionsList from '../../billing/components/subscriptions-list.component.vue';
import HotelSubscriptionPayment from '../../billing/components/hotel-subscription-payment.component.vue';
import UserProfileForm from '../../profiles/components/user-profile-form.component.vue';

const errorMessage = ref('');
const router = useRouter();
const toast = useToast();
const { registerHotel, isLoading } = useAuth();
const showEditDetails = ref(false);
const showSubscriptions = ref(false);
const showUserProfileForm = ref(false);
const registeredHotel = ref(null);
const selectedSubscription = ref(null);
const hotelPassword = ref('');

async function handleRegistration(formData) {
  errorMessage.value = '';

  try {
    // Registrar el hotel con rol ADMIN
    const hotel = await registerHotel({
      username: formData.username,
      password: formData.password
    });
    hotelPassword.value = formData.password; // Guardar la contraseña
    // Login automático tras registro
    await AuthService.signIn({
      username: formData.username,
      password: formData.password
    });
    toast.add({
      severity: 'success',
      summary: 'Hotel Registrado',
      detail: `Hotel "${formData.hotelName}" registrado exitosamente. Ahora completa los datos de tu hotel.`,
      life: 3000
    });
    registeredHotel.value = { ...hotel, name: formData.hotelName };
    showEditDetails.value = true;

  } catch (error) {
    errorMessage.value = error.message;
  }
}

function handleSaveHotelDetails() {
  showEditDetails.value = false;
  showUserProfileForm.value = true;
}

function handleProfileCreated() {
  console.log('Evento profile-created recibido, mostrando lista de suscripciones');
  showUserProfileForm.value = false;
  showSubscriptions.value = true;
  selectedSubscription.value = null; // Reinicia selección para mostrar la lista
}

function handleSelectSubscription(sub) {
  selectedSubscription.value = sub;
  showSubscriptions.value = false; // Oculta la lista y muestra el pago
}

function handlePaymentSuccess() {
  toast.add({ severity: 'success', summary: '¡Suscripción completada!', detail: 'Tu hotel ya tiene una suscripción activa.', life: 4000 });
  // Aquí puedes redirigir o mostrar un mensaje final
}
</script>

<template>
  <div class="register-hotel-container">
    <div class="register-hotel-image-container">
      <img src="/src/assets/img/auth_hotel_img.jpg" alt="Registro de Hoteles - Fondo" class="register-hotel-image" />
    </div>
    <div class="register-hotel-form-container">
      <pv-card class="register-hotel-card">
        <template #title>
          <h2 class="register-hotel-title">Registra tu Hotel en la Plataforma</h2>
          <p class="register-hotel-subtitle">Completa el formulario para empezar a disfrutar de nuestros servicios y optimizar la gestión de tu establecimiento.</p>
        </template>
        <template #content>
          <RegisterHotelForm
              v-if="!showEditDetails && !showUserProfileForm && !showSubscriptions && !selectedSubscription"
              :loading="isLoading"
              @submit-registration="handleRegistration"
          />
          <EditHotelDetails
              v-else-if="showEditDetails && !showUserProfileForm && !showSubscriptions && !selectedSubscription"
              :hotel="registeredHotel"
              @save-details="handleSaveHotelDetails"
          />
          <UserProfileForm
              v-else-if="showUserProfileForm && !showSubscriptions && !selectedSubscription"
              :password="hotelPassword"
              @profile-created="handleProfileCreated"
          />
          <SubscriptionsList
              v-else-if="showSubscriptions && !selectedSubscription"
              @select-subscription="handleSelectSubscription"
          />
          <HotelSubscriptionPayment
              v-else-if="selectedSubscription"
              :hotel-id="registeredHotel?.id"
              :subscription-plan="selectedSubscription"
              @payment-success="handlePaymentSuccess"
          />
          <pv-message severity="error" v-if="errorMessage && !isLoading" class="mt-3 page-error-message">{{ errorMessage }}</pv-message>
        </template>
      </pv-card>
      <pv-toast position="top-right" />
    </div>
  </div>
</template>

<style scoped>
/* Estilos adaptados para el registro de hoteles, manteniendo consistencia con login/register */
.register-hotel-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden; /* Previene scroll general */
  position: relative;
  background-color: #f4f6f8; /* Un fondo ligeramente distinto y profesional */
}

.register-hotel-image-container {
  flex: 1;
  display: none; /* Oculto en móviles por defecto */
  overflow: hidden;
  max-height: 100vh; /* Asegura que no exceda la altura de la ventana */
}

.register-hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.register-hotel-form-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  overflow-y: auto; /* Permite scroll vertical solo en el formulario si es necesario */
  height: 100%; /* Ocupa toda la altura del contenedor padre */
}

.register-hotel-card {
  width: 100%;
  max-width: 500px; /* Ancho base para el card */
  border-radius: 14px; /* Bordes un poco más redondeados */
  box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* Sombra más pronunciada */
  padding: 1.5rem; /* Padding interno del card */
}

.register-hotel-title {
  font-size: 1.9rem; /* Tamaño de título ajustado */
  color: var(--color-secondary, #263238);
  margin-bottom: 0.75rem;
  text-align: center;
  font-weight: 600;
}

.register-hotel-subtitle {
  font-size: 0.95rem;
  color: var(--text-color-secondary, #57606f);
  margin-bottom: 2rem; /* Más espacio después del subtítulo */
  text-align: center;
  line-height: 1.6;
}

/* Se eliminan los estilos del formulario de aquí, ya que se movieron a registerHotelForm.component.vue */
/* .register-hotel-form { ... } */
/* .register-hotel-button { ... } */

/* Media query para pantallas más grandes */
@media screen and (min-width: 768px) {
  .register-hotel-container {
    flex-direction: row;
  }

  .register-hotel-image-container {
    display: block;
    flex-basis: 50%; /* Imagen y formulario dividen el espacio */
  }

  .register-hotel-form-container {
    flex-basis: 50%;
  }
  .register-hotel-card {
    max-width: 550px;
    padding: 2rem; /* Más padding en el card en pantallas grandes */
  }
}

/* Para pantallas muy grandes, se puede refinar más si es necesario */
@media screen and (min-width: 1200px) {
  .register-hotel-card {
    max-width: 600px;
  }
}

.page-error-message {
  margin-top: 1rem; /* Espacio para el mensaje de error de página */
}

</style>