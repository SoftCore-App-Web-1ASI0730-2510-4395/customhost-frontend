<!-- src/app/billing/components/payment-summary-card.component.vue -->
<template>
  <pv-card class="shadow-1 border-round-lg">
    <template #title>
      Resumen de tu Reserva
    </template>
    <template #content>
      <div v-if="paymentData">
        <div class="mb-4">
          <h4>Huésped</h4>
          <p>{{ paymentData.user.fullName }}</p>
        </div>

        <div class="mb-4">
          <h4>Hotel</h4>
          <p>{{ paymentData.hotel.name }}</p>
        </div>

        <div class="mb-4">
          <h4>Habitación</h4>
          <p>{{ paymentData.room.number }} - {{ paymentData.room.type }}</p>
          <p><strong>Precio por noche:</strong> ${{ paymentData.room.price }} USD</p>
          <p><strong>Total a pagar:</strong> ${{ totalAmount }} USD</p>
          <p><i class="text-sm">Entrada: {{ formattedCheckIn }}</i></p>
          <p><i class="text-sm">Salida: {{ formattedCheckOut }}</i></p>
        </div>
      </div>
      <div v-else>
        Cargando información...
      </div>
    </template>
  </pv-card>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    paymentData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const totalAmount = computed(() => {
      if (!props.paymentData.checkInDate || !props.paymentData.checkOutDate) {
        return props.paymentData.room.price * 4; // Fallback
      }

      const start = new Date(props.paymentData.checkInDate);
      const end = new Date(props.paymentData.checkOutDate);

      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return props.paymentData.room.price * diffDays;
    });

    const formattedCheckIn = computed(() => {
      const date = new Date(props.paymentData.checkInDate);
      return date.toLocaleDateString('es-ES');
    });

    const formattedCheckOut = computed(() => {
      const date = new Date(props.paymentData.checkOutDate);
      return date.toLocaleDateString('es-ES');
    });

    return {
      totalAmount,
      formattedCheckIn,
      formattedCheckOut
    };
  }
};
</script>