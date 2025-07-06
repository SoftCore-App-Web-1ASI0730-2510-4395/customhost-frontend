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
    // Guardar el userId del hotel creado
    const userId = hotel?.id;
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
    registeredHotel.value = { ...hotel, name: formData.hotelName, userId };
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
.register-hotel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f6f8;
}

.register-hotel-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.register-hotel-card {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(34,197,94,0.07);
  background: #fff;
}

.register-hotel-title {
  text-align: center;
  margin-bottom: 0.5rem;
}

.register-hotel-subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

</style>