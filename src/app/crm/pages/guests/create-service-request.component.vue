<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Crear Nueva Solicitud</div>
    <div class="flex flex-column md:flex-row gap-6 justify-content-center">
      <!-- Card de formulario a la izquierda -->
      <div class="flex-1 min-w-0">
        <div class="card p-4 shadow-1 border-round-lg">
          <div class="flex align-items-center gap-2 mb-5">
            <i class="pi pi-send text-3xl text-primary" />
            <span class="text-2xl font-bold text-primary">Enviar Solicitud</span>
          </div>
          <form @submit.prevent="submitRequest">
            <div class="field mb-4">
              <label for="type" class="block font-semibold mb-2 text-lg text-primary">Tipo de Solicitud</label>
              <pv-select id="type" v-model="request.type" :options="types" placeholder="Selecciona..." class="w-full" />
            </div>
            <div class="field mb-4">
              <label for="description" class="block font-medium mb-2">Descripción</label>
              <pv-textarea id="description" v-model="request.description" rows="4" class="w-full" />
            </div>
            <div class="field mb-4">
              <label for="priority" class="block font-medium mb-2">Prioridad</label>
              <pv-select id="priority" v-model="request.priority" :options="priorityOptions" class="w-full" />
            </div>
            <div class="field mb-4">
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
        </div>
      </div>
      <!-- Card de historial a la derecha -->
      <div class="flex-1 min-w-0">
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
              <template v-for="(hotelRequests, hotelId) in groupedByHotelAndRoom" :key="hotelId">
                <div class="mb-4 p-3 border-2 border-primary border-round-lg bg-primary-50">
                  <div class="text-lg font-bold text-primary mb-2">
                    Hotel #{{ hotelId }}
                  </div>
                  <template v-for="(roomRequests, roomId) in hotelRequests" :key="roomId">
                    <div class="mb-2 p-2 border-1 border-blue-200 border-round-md bg-blue-50">
                      <div class="font-semibold text-blue-700 mb-1">Habitación #{{ roomId }}</div>
                      <div class="flex flex-column gap-2">
                        <div v-for="req in roomRequests" :key="req.id" class="border-1 surface-border shadow-none card p-3 mb-2 bg-white">
                          <div class="flex align-items-center gap-2 mb-2">
                            <span class="font-bold">{{ req.title }}</span>
                            <span class="ml-auto text-xs text-gray-500" v-if="req.createdAt">{{ new Date(req.createdAt).toLocaleString() }}</span>
                          </div>
                          <div class="mb-1"><b>Descripción:</b> {{ req.description }}</div>
                          <div class="mb-1"><b>Tipo:</b> {{ req.type }}</div>
                          <div class="mb-1"><b>Estado:</b> {{ req.status }}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
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
import { ref, onMounted, computed } from 'vue';
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
          // Solo mostramos el número y tipo de habitación, sin el estado
          label: `#${room.roomNumber} - ${room.type}`
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
        console.log('[loadUserServiceRequests] INICIO');
        console.log('[loadUserServiceRequests] userId.value (antes de localStorage):', userId.value);
        if (!userIdLocal) {
          const userData = localStorage.getItem('userData');
          console.log('[loadUserServiceRequests] userData from localStorage:', userData);
          if (userData) {
            const parsed = JSON.parse(userData);
            userIdLocal = parsed.id;
            console.log('[loadUserServiceRequests] parsed userId:', userIdLocal);
          }
        }
        console.log('[loadUserServiceRequests] userIdLocal (después de localStorage):', userIdLocal);
        if (!userIdLocal) {
          console.error('[loadUserServiceRequests] No userId found');
          serviceRequests.value = [];
          loadingHistory.value = false;
          return;
        }
        // Cambia la URL para apuntar al backend real
        const url = `http://localhost:5232/api/v1/crm/service-request/user/${userIdLocal}`;
        console.log('[loadUserServiceRequests] Fetching:', url);
        // Obtener token de localStorage
        let token = null;
        const userDataToken = localStorage.getItem('userData');
        if (userDataToken) {
          try {
            const parsed = JSON.parse(userDataToken);
            token = parsed.token;
            console.log('[loadUserServiceRequests] Token obtenido:', token);
          } catch (e) {
            console.error('[loadUserServiceRequests] Error al parsear token:', e);
          }
        }
        const fetchOptions = {
          headers: token ? { 'Authorization': `Bearer ${token}`, 'accept': 'application/json' } : { 'accept': 'application/json' }
        };
        console.log('[loadUserServiceRequests] fetch options:', fetchOptions);
        try {
          const res = await fetch(url, fetchOptions);
          console.log('[loadUserServiceRequests] Response:', res);
          console.log('[loadUserServiceRequests] Response status:', res.status);
          // Mostrar todos los headers recibidos
          for (let pair of res.headers.entries()) {
            console.log(`[loadUserServiceRequests] Response header: ${pair[0]}: ${pair[1]}`);
          }
          if (!res.ok) {
            const errorText = await res.text();
            console.error('[loadUserServiceRequests] Error response body:', errorText);
            throw new Error('No se pudo cargar el historial');
          }
          const data = await res.json();
          console.log('[loadUserServiceRequests] Data:', data);
          serviceRequests.value = Array.isArray(data) ? data : [];
        } catch (e) {
          console.error('[loadUserServiceRequests] Error (catch):', e);
          if (e instanceof TypeError) {
            console.error('[loadUserServiceRequests] TypeError (posible CORS o red):', e.message);
          }
          serviceRequests.value = [];
        }
        console.log('[loadUserServiceRequests] serviceRequests.value:', serviceRequests.value);
      } catch (e) {
        console.error('[loadUserServiceRequests] Error:', e);
        serviceRequests.value = [];
      } finally {
        loadingHistory.value = false;
        console.log('[loadUserServiceRequests] loadingHistory:', loadingHistory.value);
      }
    };

    const groupRequestsByHotelAndRoom = (requests) => {
      const grouped = {};
      requests.forEach(req => {
        if (!grouped[req.hotelId]) grouped[req.hotelId] = {};
        if (!grouped[req.hotelId][req.roomId]) grouped[req.hotelId][req.roomId] = [];
        grouped[req.hotelId][req.roomId].push(req);
      });
      return grouped;
    };

    const groupedByHotelAndRoom = computed(() => groupRequestsByHotelAndRoom(serviceRequests.value));

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
      loadingHistory,
      groupedByHotelAndRoom
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