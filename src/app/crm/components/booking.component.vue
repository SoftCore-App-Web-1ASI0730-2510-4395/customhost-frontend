<!-- src/components/BookingForm.vue -->
<template>
  <div class="booking-form">
    <form @submit.prevent="save">
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-input-text v-model="booking.userId" required />
            <label>ID del Huésped</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-input-text v-model="booking.hotelId" required />
            <label>ID del Hotel</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-input-text v-model="booking.roomId" required />
            <label>ID de la Habitación</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-input-text type="datetime-local" v-model="booking.checkInDate" required />
            <label>Fecha de Entrada</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-input-text type="datetime-local" v-model="booking.checkOutDate" required />
            <label>Fecha de Salida</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-input-number v-model="booking.totalPrice" mode="currency" currency="USD" locale="en-US" required />
            <label>Precio Total</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-select v-model="booking.status" :options="statusOptions" optionLabel="label" optionValue="value" />
            <label>Estado</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <pv-select v-model="booking.paymentStatus" :options="paymentStatusOptions" optionLabel="label" optionValue="value" />
            <label>Estado de Pago</label>
          </span>
        </div>
        <div class="col-12 flex justify-content-end">
          <pv-button label="Guardar" type="submit" icon="pi pi-check" />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import bookingService from '../services/book.service.js';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['on-save']);

const booking = ref({ ...props.initialData });

const router = useRouter();

const statusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Confirmada', value: 'confirmed' },
  { label: 'Cancelada', value: 'cancelled' }
];

const paymentStatusOptions = [
  { label: 'No Pagado', value: 'unpaid' },
  { label: 'Pagado', value: 'paid' }
];

async function save() {
  if (booking.value.id) {
    await bookingService.update(booking.value.id, booking.value);
  } else {
    await bookingService.create(booking.value);
  }

  emit('on-save');
}
</script>