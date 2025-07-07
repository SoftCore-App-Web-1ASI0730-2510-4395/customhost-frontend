<!-- src/app/guest-experience/components/ServiceRequestCard.vue -->
<template>
  <pv-card class="request-card shadow-2 transition-all transition-duration-300 hover:shadow-6">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        {{ serviceRequest.type }}
        <pv-badge :severity="statusSeverity">{{ serviceRequest.status }}</pv-badge>
      </div>
    </template>

    <template #content>
      <p>{{ serviceRequest.description || 'Sin descripción' }}</p>

      <div class="grid mt-3">
        <div class="col-6">
          <i class="pi pi-clock mr-2"></i><strong>Prioridad:</strong> {{ serviceRequest.priority }}
        </div>
        <div class="col-6 text-right">
          <i class="pi pi-calendar mr-2"></i><strong>Creada:</strong> {{ formattedDate }}
        </div>
      </div>
    </template>
  </pv-card>
</template>

<script>
import {computed} from "vue";

export default {
  props: {
    serviceRequest: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const statusSeverity = computed(() => {
      switch (props.serviceRequest.status) {
        case 'Resolved':
          return 'success';
        case 'Assigned':
          return 'info';
        default:
          return 'warning';
      }
    });

    const formattedDate = computed(() => {
      return props.serviceRequest.formattedCreatedAt;
    });

    return { statusSeverity, formattedDate };
  }
};
</script>

<style scoped>
.request-card {
  border-radius: 12px;
  padding: 1rem;
}
</style>