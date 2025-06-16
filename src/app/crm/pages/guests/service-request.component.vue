<!-- src/app/crm/pages/guests/service-request.component.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Mis Solicitudes de Servicio</div>

    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <div v-else-if="requests.length > 0" class="grid">
      <div v-for="request in requests" :key="request.id" class="col-12 md:col-6 lg:col-4">
        <ServiceRequestCard :service-request="request" />
      </div>
    </div>

    <div v-else class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-info-circle text-6xl text-blue-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">No tienes ninguna solicitud pendiente.</span>
      <pv-button label="Crear Nueva Solicitud" icon="pi pi-plus" class="mt-4" @click="goToNewRequest" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GuestFacade from '../../services/guest.facade.js';
import ServiceRequestCard from '../../components/guests/service-request-card.component.vue';

export default {
  components: { ServiceRequestCard },
  setup() {
    const router = useRouter();
    const requests = ref([]);
    const loading = ref(true);

    const loadRequests = async () => {
      loading.value = true;
      try {
        const userId = 1; // TODO: Obtener desde sesión o store
        const data = await GuestFacade.getGuestServiceRequests(userId);
        requests.value = data;
      } catch (error) {
        console.error('Error cargando solicitudes:', error);
      } finally {
        loading.value = false;
      }
    };

    const goToNewRequest = () => {
      router.push({ name: 'CreateServiceRequestPage' });
    };

    onMounted(() => {
      loadRequests();
    });

    return {
      requests,
      loading,
      goToNewRequest
    };
  }
};
</script>

<style scoped>
.surface-section {
  background-color: #f8f9fa;
}
</style>