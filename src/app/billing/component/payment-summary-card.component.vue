<!-- src/app/billing/component/payment-summary-card.component.vue -->

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
          <p><strong>Total estimado:</strong> ${{ totalAmount }} USD (4 noches)</p>
        </div>
      </div>
      <div v-else>
        Cargando información...
      </div>
    </template>
  </pv-card>
</template>

<script>
import {computed} from "vue";

export default {
  props: {
    paymentData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const totalAmount = computed(() => {
      return props.paymentData.room.price * 4; // Simulamos 4 noches
    });

    return {
      totalAmount
    };
  }
};
</script>