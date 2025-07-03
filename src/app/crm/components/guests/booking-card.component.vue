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
          <!-- Mostrar hotel y total solo en modo edición -->
          <template v-if="mode === 'edit'">
            <p><i class="pi pi-building mr-2"></i><strong>Hotel:</strong> {{ hotel?.name || 'Cargando...' }}</p>
            <p><i class="pi pi-money-bill mr-2"></i><strong>Total:</strong> ${{ booking.totalPrice }} USD</p>
          </template>
        </div>
      </div>

      <div class="mt-3 flex justify-content-end">
        <!-- Botón según el modo -->
        <pv-button
            v-if="mode === 'edit'"
            label="Eliminar"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="handleDelete"
        />
        <pv-button
            v-else
            label="Ver más"
            icon="pi pi-eye"
            class="p-button-text p-button-sm"
            @click="handleView"
        />
      </div>
    </template>
  </pv-card>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { getHotelById } from '../../services/hotels.service.js';

export default {
  name: 'BookingCard',
  props: {
    booking: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'edit',
      validator: v => ['edit', 'view'].includes(v)
    }
  },
  emits: ['delete-booking', 'view-booking'],
  setup(props, { emit }) {
    const hotel = ref(null);
    onMounted(async () => {
      if (props.booking.hotelId) {
        try {
          hotel.value = await getHotelById(props.booking.hotelId);
        } catch (e) {
          hotel.value = { name: 'Desconocido' };
        }
      }
    });

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

    const checkInDate = computed(() =>
        new Date(props.booking.checkInDate).toLocaleDateString('es-ES')
    );
    const checkOutDate = computed(() =>
        new Date(props.booking.checkOutDate).toLocaleDateString('es-ES')
    );

    const handleDelete = () => emit('delete-booking', props.booking.id);
    const handleView   = () => emit('view-booking', props.booking.id);

    return { statusSeverity, checkInDate, checkOutDate, handleDelete, handleView, hotel };
  }
};
</script>

<style scoped>
.booking-card {
  border-radius: 12px;
  padding: 1rem;
}
</style>
