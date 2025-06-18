<!-- src/app/crm/components/guests/booking-card.component.vue -->
<template>
  <pv-card class="booking-card shadow-2 transition-all transition-duration-300 hover:shadow-6">
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span>{{ booking.roomType }} {{ booking.roomNumber }}</span>
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
        <pv-button
            label="Eliminar"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="handleDelete"
        />
      </div>
    </template>
  </pv-card>
</template>

<script>
import {computed} from "vue";
import {deleteBooking} from "../../services/booking.service.js";

export default {
  methods: {deleteBooking},
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
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

    // Nueva función para refrescar la página tras eliminar
    const handleDelete = () => {
      emit('delete-booking', props.booking.id);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    return { statusSeverity, checkInDate, checkOutDate, handleDelete };
  }
};
</script>

<style scoped>
.booking-card {
  border-radius: 12px;
  padding: 1rem;
}
</style>