<!-- src/app/crm/pages/guests/create-service-request.component.vue -->
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
          <pv-select id="priority" v-model="request.priority" :options="['normal', 'Urgente']" class="w-full" />
        </div>

        <pv-button label="Enviar Solicitud" icon="pi pi-send" class="mt-3 w-full" />
      </form>
    </Card>
  </div>
</template>

<script>
import GuestFacade from '../../services/guest.facade.js';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const types = ['Limpieza', 'Reparación', 'Soporte Técnico', 'Solicitud de Artículos', 'Otro'];
    const request = {
      type: '',
      description: '',
      priority: 'normal',
      userId: 1, // TODO: Dinámico
      hotelId: 1, // TODO: Basado en habitación
      roomId: 101, // TODO: Basado en reserva activa
      status: 'Pending'
    };

    const submitRequest = async () => {
      try {
        await GuestFacade.submitServiceRequest(request);
        await router.push({name: 'MyServiceRequestsPage'});
      } catch (error) {
        console.error('Error al enviar solicitud:', error);
      }
    };

    return {
      types,
      request,
      submitRequest
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
</style>