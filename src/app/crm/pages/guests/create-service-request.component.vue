<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Crear Nueva Solicitud</div>

    <Card class="card p-4 shadow-1 border-round-lg">
      <form @submit.prevent="submitRequest">
        <div class="field">
          <label for="title" class="block font-medium mb-2">Título</label>
          <pv-input id="title" v-model="request.title" placeholder="Título de la solicitud" class="w-full" maxlength="200" />
        </div>

        <div class="field">
          <label for="type" class="block font-medium mb-2">Tipo de Solicitud</label>
          <pv-select id="type" v-model="request.type" :options="types" placeholder="Selecciona..." class="w-full" />
        </div>

        <div class="field">
          <label for="description" class="block font-medium mb-2">Descripción</label>
          <pv-textarea id="description" v-model="request.description" rows="4" class="w-full" />
        </div>

        <div class="field">
          <label for="priority" class="block font-medium mb-2">Prioridad</label>
          <pv-select id="priority" v-model="request.priority" :options="priorityOptions" class="w-full" />
        </div>

        <div class="field">
          <label for="roomId" class="block font-medium mb-2">Habitación</label>
          <pv-select
            id="roomId"
            v-model="request.roomId"
            :options="roomOptions"
            option-label="label"
            option-value="id"
            placeholder="Selecciona una habitación"
            class="w-full"
          />
        </div>

        <pv-button
          type="submit"
          label="Enviar Solicitud"
          icon="pi pi-send"
          class="mt-3 w-full"
          :loading="sending"
          :disabled="!request.type || !request.description || !request.priority || !request.roomId"
        />
      </form>
      <div v-if="successMessage" class="notification-box success mt-3">
        {{ successMessage }}
      </div>
    </Card>
  </div>
</template>

<script>
import GuestFacade from '../../services/guest.facade.js';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const types = ['Limpieza', 'Reparación', 'Soporte Técnico', 'Solicitud de Artículos', 'Otro'];
    const priorityOptions = ['Baja', 'Media', 'Alta', 'Urgente'];
    const request = ref({
      type: '',
      description: '',
      priority: '',
      roomId: ''
    });
    const sending = ref(false);
    const successMessage = ref('');
    const roomOptions = ref([]);
    const userId = ref(null);
    const hotelId = ref(null);

    // Obtiene el usuario actual y sus habitaciones desde el facade
    const loadUserRoomsAndInfo = async () => {
      try {
        userId.value = 1;
        const userRooms = await GuestFacade.getUserRooms(userId.value);
        roomOptions.value = userRooms.map(room => ({
          id: room.id,
          label: `#${room.roomNumber} - ${room.type} (${room.status})`
        }));
        hotelId.value = userRooms.length > 0 ? userRooms[0].hotelId : 1;
      } catch (e) {
        roomOptions.value = [];
        hotelId.value = 1;
      }
    };

    const submitRequest = async () => {
      if (!request.value.type || !request.value.description || !request.value.priority || !request.value.roomId) {
        successMessage.value = 'Por favor, completa todos los campos obligatorios.';
        return;
      }
      sending.value = true;
      try {
        await GuestFacade.submitServiceRequest({
          ...request.value,
          title: request.value.type, // El título será igual al tipo
          userId: userId.value,
          hotelId: hotelId.value
        });
        // Limpiar formulario tras enviar
        request.value = {
          title: '',
          type: '',
          description: '',
          priority: '',
          roomId: ''
        };
        successMessage.value = '✅ Tu solicitud fue enviada exitosamente. Verás la respuesta en notificaciones.';
        setTimeout(() => {
          router.push({ name: 'MyServiceRequestsPage' });
        }, 2000);
      } catch (error) {
        successMessage.value = 'Error al enviar la solicitud. Intenta de nuevo.';
      } finally {
        sending.value = false;
      }
    };

    onMounted(() => {
      loadUserRoomsAndInfo();
    });

    return {
      types,
      priorityOptions,
      request,
      submitRequest,
      sending,
      successMessage,
      roomOptions
    };
  }
};
</script>

<style>
.card {
  max-width: 600px;
  margin: 0 auto;
  color: #2E3C43;
}
.text-3xl{
  color: #2E3C43;
}
.notification-box.success {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 1rem;
}
</style>