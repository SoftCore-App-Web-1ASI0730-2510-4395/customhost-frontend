<!-- src/app/crm/components/guests/booking-card.component.vue -->
<template>
  <pv-card class="booking-card shadow-2 transition-all transition-duration-300 hover:shadow-6">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span>Habitación {{ booking.roomNumber }}</span>
        <pv-badge :severity="statusSeverity">{{ booking.status }}</pv-badge>
      </div>
    </template>

    <template #content>
      <div class="grid">
        <div class="col-12 md:col-6">
          <p><i class="pi pi-calendar mr-2"></i><strong>Entrada:</strong> {{ checkInDate }}</p>
          <p><i class="pi pi-calendar-times mr-2"></i><strong>Salida:</strong> {{ checkOutDate }}</p>
        </div>
        <div class="col-12 md:col-6">
          <p><i class="pi pi-user mr-2"></i><strong>Huésped:</strong> {{ booking.guestName }}</p>
          <p><i class="pi pi-money-bill mr-2"></i><strong>Total:</strong> ${{ booking.totalPrice }} USD</p>
        </div>
      </div>

      <div class="mt-3 flex justify-content-end">
        <pv-button label="Ver Detalles" icon="pi pi-eye" class="p-button-outlined p-button-sm mr-2" />
        <pv-button label="Cancelar" icon="pi pi-trash" class="p-button-danger p-button-sm" v-if="booking.isActive" />
      </div>
    </template>
  </pv-card>
</template>

<script>
import {computed} from "vue";

export default {
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const statusSeverity = computed(() => {
      switch (props.booking.status) {
        case 'active':
          return 'success';
        case 'cancelled':
          return 'danger';
        case 'pending':
          return 'warning';
        default:
          return 'secondary';
      }
    });

    const checkInDate = computed(() => {
      return props.booking.checkInDate.toLocaleDateString('es-ES');
    });

    const checkOutDate = computed(() => {
      return props.booking.checkOutDate.toLocaleDateString('es-ES');
    });

    return { statusSeverity, checkInDate, checkOutDate };
  }
};
</script>

<style scoped>
.booking-card {
  border-radius: 12px;
  padding: 1rem;
}
</style>