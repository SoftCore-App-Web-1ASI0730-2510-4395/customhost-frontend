<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Mis Solicitudes de Servicio</div>

    <!-- Mensaje visual de éxito -->
    <div v-if="successMessage" class="notification-box success">
      {{ successMessage }}
    </div>

    <!-- Formulario de nueva solicitud -->
    <div v-if="showForm" class="request-form-box">
      <h3 class="mb-3">Nueva Solicitud de Servicio</h3>
      <form @submit.prevent="submitRequest">
        <div class="mb-2">
          <label for="type">Tipo de Solicitud</label>
          <select v-model="form.type" id="type" required>
            <option disabled value="">Seleccione tipo</option>
            <option v-for="type in requestTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="mb-2">
          <label for="priority">Prioridad</label>
          <select v-model="form.priority" id="priority" required>
            <option disabled value="">Seleccione prioridad</option>
            <option v-for="prio in priorityOptions" :key="prio" :value="prio">{{ prio }}</option>
          </select>
        </div>
        <div class="mb-2">
          <label for="description">Descripción</label>
          <textarea v-model="form.description" id="description" rows="3" required></textarea>
        </div>
        <div class="mb-2">
          <label for="roomId">Habitación</label>
          <select v-model="form.roomId" id="roomId" required>
            <option disabled value="">Seleccione habitación</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.roomNumber }} - {{ room.type }}
            </option>
          </select>
        </div>
        <div class="flex gap-2 mt-3">
          <pv-button type="submit" label="Enviar Solicitud" icon="pi pi-send" :loading="sending" />
          <pv-button type="button" label="Cancelar" class="p-button-secondary" @click="showForm = false" />
        </div>
      </form>
    </div>

    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <div v-else-if="requests.length > 0 && !showForm" class="grid">
      <div v-for="request in requests" :key="request.id" class="col-12 md:col-6 lg:col-4">
        <ServiceRequestCard :service-request="request" />
      </div>
    </div>

    <div v-else-if="!showForm" class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-info-circle text-6xl text-blue-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">No tienes ninguna solicitud pendiente.</span>
      <pv-button label="Crear Nueva Solicitud" icon="pi pi-plus" class="mt-4" @click="openForm" />
    </div>
    <div v-if="!showForm && requests.length > 0" class="flex justify-content-center mt-4">
      <pv-button label="Crear Nueva Solicitud" icon="pi pi-plus" @click="openForm" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GuestFacade from '../services/guest.facade.js';
import ServiceRequestCard from '../../components/guests/service-request-card.component.vue';

export default {
  components: { ServiceRequestCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const requests = ref([]);
    const loading = ref(true);
    const successMessage = ref('');
    const showForm = ref(false);
    const sending = ref(false);

    // Opciones de formulario
    const requestTypes = ref(['Toallas/Ropa', 'Limpieza', 'Reparación', 'Room Service', 'Otros']);
    const priorityOptions = ref(['Baja', 'Media', 'Alta', 'Urgente']);
    const rooms = ref([]);
    const form = ref({
      type: '',
      priority: '',
      description: '',
      roomId: ''
    });

    const userId = 1; // TODO: Obtener desde sesión/store
    const hotelId = 1; // TODO: Obtener desde sesión/store

    const loadRequests = async () => {
      loading.value = true;
      try {
        const data = await GuestFacade.getGuestServiceRequests(userId);
        requests.value = data;
      } catch (error) {
        console.error('Error cargando solicitudes:', error);
      } finally {
        loading.value = false;
      }
    };

    const loadRooms = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_URL}/rooms`);
        rooms.value = await res.json();
      } catch (e) {
        rooms.value = [];
      }
    };

    const openForm = () => {
      showForm.value = true;
      // Limpiar formulario
      form.value = {
        type: '',
        priority: '',
        description: '',
        roomId: ''
      };
    };

    const submitRequest = async () => {
      sending.value = true;
      try {
        await GuestFacade.submitServiceRequest({
          ...form.value,
          userId,
          hotelId
        });
        // Redirige con success=1 para mostrar mensaje
        router.replace({ query: { success: 1 } });
        showForm.value = false;
        await loadRequests();
      } catch (e) {
        alert('Error al enviar la solicitud');
      } finally {
        sending.value = false;
      }
    };

    onMounted(() => {
      if (route.query.success === '1') {
        successMessage.value = '✅ Tu solicitud fue enviada correctamente. La respuesta se enviará por notificaciones.';
        setTimeout(() => (successMessage.value = ''), 3500);
        // Limpiar query param para evitar mensaje al refrescar
        router.replace({ query: {} });
      }
      loadRooms();
      loadRequests();
    });

    return {
      requests,
      loading,
      openForm,
      showForm,
      form,
      requestTypes,
      priorityOptions,
      rooms,
      submitRequest,
      sending,
      successMessage
    };
  }
};
</script>

<style scoped>
.surface-section {
  background-color: #f8f9fa;
}
.notification-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}
.notification-box.success {
  background-color: #4CAF50;
}
.request-form-box {
  max-width: 500px;
  margin: 0 auto 2rem auto;
  background: #fff;
  border-radius: 10px;
  padding: 2rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}
.request-form-box label {
  font-weight: 500;
  display: block;
  margin-bottom: 0.2rem;
}
.request-form-box select,
.request-form-box textarea {
  width: 100%;
  margin-bottom: 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 0.5rem;
}
@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
