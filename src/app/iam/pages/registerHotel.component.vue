// filepath: c:\Users\halli\OneDrive\Documentos\customhost\wa\src\auth\pages\registerHotelComponent.vue
<script>
import { Card, Toast, Message } from "primevue";
import RegisterHotelForm from '../components/registerHotelForm.component.vue'; // Importar el nuevo componente

export default {
  name: "registerHotelComponent",
  components: {
    'pv-card': Card,
    'pv-toast': Toast,
    'pv-message': Message,
    RegisterHotelForm // Registrar el componente del formulario
  },
  data() {
    return {
      // Ya no se necesitan los campos del formulario aquí
      // hotelName: '',
      // username: '',
      // email: '',
      // password: '',
      // passwordRepeat: '',
      // submitted: false, // Se manejará en el hijo o se pasará como prop si es necesario para el padre
      loading: false,
      errorMessage: '' // Mensaje de error general para la página (ej. error de servidor)
    }
  },
  methods: {
    handleRegistration(formData) {
      this.errorMessage = '';
      this.loading = true;

      // Simulación de la lógica de registro del hotel con los datos del formulario hijo
      console.log("Datos recibidos del formulario:", formData);

      setTimeout(() => {
        console.log("Registrando Hotel:", formData.hotelName, "Admin:", formData.username, "Email:", formData.email);
        // Ejemplo de notificación de éxito:
        // this.$toast.add({severity:'success', summary: 'Solicitud Recibida', detail:'Gracias por registrar tu hotel. Nos pondremos en contacto pronto.', life: 5000});
        // this.$router.push('/iam/login'); // O a una página de agradecimiento/confirmación

        // Ejemplo de error del servidor:
        // this.errorMessage = 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.';

        this.loading = false;
      }, 1500);
    }
  }
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
          <!-- Usar el nuevo componente de formulario -->
          <RegisterHotelForm
              :loading="loading"
              @submit-registration="handleRegistration"
          />
          <!-- Mensaje de error general para la página -->
          <pv-message severity="error" v-if="errorMessage && !loading" class="mt-3 page-error-message">{{ errorMessage }}</pv-message>
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
