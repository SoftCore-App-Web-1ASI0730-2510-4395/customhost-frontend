<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Crear Nueva Solicitud</div>

    <Card class="card p-4 shadow-1 border-round-lg">
      <form @submit.prevent="submitRequest">
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
    <!-- Historial de solicitudes del usuario -->
    <div class="flex flex-column align-items-center justify-content-center mt-6">
      <div class="w-full md:w-7 lg:w-5">
        <div class="card p-0 shadow-1 border-round-lg">
          <div class="flex align-items-center gap-2 mb-3 p-4 border-bottom-1 surface-border">
            <i class="pi pi-history text-2xl text-primary" />
            <span class="text-xl font-bold">Historial de Solicitudes</span>
          </div>
          <div v-if="loadingHistory" class="flex justify-content-center align-items-center py-5">
            <pv-progress-spinner style="width:2rem;height:2rem" />
          </div>
          <div v-else>
            <div v-if="serviceRequests.length === 0" class="text-center text-gray-500 py-4">
              <i class="pi pi-info-circle text-2xl mb-2" />
              <div>No tienes solicitudes previas.</div>
            </div>
            <div v-else class="flex flex-column gap-3 p-3">
              <div v-for="req in serviceRequests" :key="req.id" class="border-1 surface-border shadow-none card p-3 mb-2">
                <div class="flex align-items-center gap-2 mb-2">
                  <i :class="{
                    'pi pi-cog text-blue-500': req.status === 'PENDIENTE',
                    'pi pi-check-circle text-green-500': req.status === 'RESUELTO',
                    'pi pi-exclamation-triangle text-orange-500': req.status === 'EN_PROCESO',
                    'pi pi-times-circle text-red-500': req.status === 'CANCELADO'
                  }" />
                  <span class="font-bold">{{ req.type }}</span>
                  <span class="ml-auto text-xs text-gray-500">{{ new Date(req.createdAt).toLocaleString() }}</span>
                </div>
                <div class="mb-1"><b>Habitación:</b> #{{ req.roomId }}</div>
                <div class="mb-1"><b>Prioridad:</b> {{ req.priority }}</div>
                <div class="mb-1"><b>Estado:</b> <span :class="{
                  'text-blue-500': req.status === 'PENDIENTE',
                  'text-green-500': req.status === 'RESUELTO',
                  'text-orange-500': req.status === 'EN_PROCESO',
                  'text-red-500': req.status === 'CANCELADO'
                }">{{ req.status }}</span></div>
                <div class="mb-1"><b>Descripción:</b> {{ req.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin historial -->
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
    const serviceRequests = ref([]);
    const loadingHistory = ref(true);

    // Obtiene el usuario actual y sus habitaciones desde el facade
    const loadUserRoomsAndInfo = async () => {
      try {
        // Obtener userId real desde localStorage
        let userId = null;
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            userId = parsed.id;
          }
        } catch (e) {
          console.error('[create-service-request] Error leyendo userId de localStorage:', e);
        }
        if (!userId) {
          console.error('No se encontró userId en localStorage');
          roomOptions.value = [];
          hotelId.value = 1;
          return;
        }
        const userRooms = await GuestFacade.getUserRooms(userId);
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
        // Asegura que userId sea un entero positivo
        let realUserId = userId.value;
        console.log('[submitRequest] userId.value:', userId.value);
        console.log('[submitRequest] request.value:', request.value);
        console.log('[submitRequest] hotelId.value:', hotelId.value);
        if (!realUserId || isNaN(realUserId) || parseInt(realUserId) <= 0) {
          // Intenta obtenerlo de localStorage (userData o user)
          let parsed = null;
          const userData = localStorage.getItem('userData');
          console.log('[submitRequest] userData from localStorage:', userData);
          if (userData) {
            parsed = JSON.parse(userData);
            console.log('[submitRequest] parsed from userData:', parsed);
          } else {
            const user = localStorage.getItem('user');
            console.log('[submitRequest] user from localStorage:', user);
            if (user) {
              parsed = JSON.parse(user);
              console.log('[submitRequest] parsed from user:', parsed);
            }
          }
          if (parsed && parsed.id && parseInt(parsed.id) > 0) {
            realUserId = parseInt(parsed.id);
            userId.value = realUserId;
            console.log('[submitRequest] realUserId set from parsed:', realUserId);
          } else {
            successMessage.value = 'No se pudo determinar el usuario. Intenta recargar la página.';
            sending.value = false;
            console.log('[submitRequest] No se pudo determinar el usuario.');
            return;
          }
        }
        console.log('[submitRequest] realUserId (final):', realUserId);
        await GuestFacade.submitServiceRequest({
          ...request.value,
          title: request.value.type, // El título será igual al tipo
          userId: realUserId,
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
      } catch (error) {
        successMessage.value = 'Error al enviar la solicitud. Intenta de nuevo.';
        console.error('[submitRequest] Error al enviar la solicitud:', error);
      } finally {
        sending.value = false;
      }
    };

    const loadUserServiceRequests = async () => {
      loadingHistory.value = true;
      try {
        let userIdLocal = userId.value;
        if (!userIdLocal) {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            userIdLocal = parsed.id;
          }
        }
        if (!userIdLocal) {
          serviceRequests.value = [];
          loadingHistory.value = false;
          return;
        }
        // Llama al endpoint de historial de solicitudes por usuario
        const res = await fetch(`/api/v1/crm/service-request/user/${userIdLocal}`);
        if (!res.ok) throw new Error('No se pudo cargar el historial');
        const data = await res.json();
        serviceRequests.value = Array.isArray(data) ? data : [];
      } catch (e) {
        serviceRequests.value = [];
      } finally {
        loadingHistory.value = false;
      }
    };

    onMounted(() => {
      loadUserRoomsAndInfo();
      loadUserServiceRequests();
    });

    return {
      types,
      priorityOptions,
      request,
      submitRequest,
      sending,
      successMessage,
      roomOptions,
      serviceRequests,
      loadingHistory
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