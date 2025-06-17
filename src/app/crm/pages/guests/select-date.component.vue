<!-- src/app/crm/pages/guests/select-date.component.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold">Selecciona tus Fechas</h2>
      <p>Elige tu fecha de entrada y salida para calcular el costo total</p>
    </div>

    <pv-card class="mb-5">
      <template #title>
        <i class="pi pi-calendar mr-2"></i> Selecciona Fechas
      </template>
      <template #content>
        <div class="grid formgrid">
          <div class="field col">
            <label for="checkIn" class="block font-medium mb-2">Fecha de Entrada</label>
            <pv-input-text id="checkIn" type="date" v-model="checkInDate" class="w-full p-inputtext-lg" />
          </div>

          <div class="field col">
            <label for="checkOut" class="block font-medium mb-2">Fecha de Salida</label>
            <pv-input-text id="checkOut" type="date" v-model="checkOutDate" class="w-full p-inputtext-lg" />
          </div>
        </div>

        <div v-if="checkInDate && checkOutDate" class="mt-4">
          <p>Número de noches: <strong>{{ nights }}</strong></p>
          <p>Precio por noche: <strong>${{ room.price }} USD</strong></p>
          <p class="font-bold text-xl mt-2">Total: ${{ totalPrice }} USD</p>
        </div>

        <div class="mt-5 text-right">
          <pv-button
              label="Continuar al Pago"
              icon="pi pi-arrow-right"
              :disabled="!checkInDate || !checkOutDate || nights <= 0"
              @click="goToPayment"
          />
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const checkInDate = ref('');
    const checkOutDate = ref('');
    const room = ref(null);

    // Cargar datos desde localStorage (habitación seleccionada)
    onMounted(() => {
      const selectedRoom = localStorage.getItem('selectedRoom');
      if (!selectedRoom) {
        router.push({ name: 'HotelRoomSelection' });
        return;
      }

      room.value = JSON.parse(selectedRoom);
    });

    // Calcular número de noches
    const nights = computed(() => {
      if (!checkInDate.value || !checkOutDate.value) return 0;

      const start = new Date(checkInDate.value);
      const end = new Date(checkOutDate.value);

      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : 0;
    });

    // Calcular precio total
    const totalPrice = computed(() => {
      return nights.value * room.value?.price || 0;
    });

    // Ir a la página de pago
    const goToPayment = () => {
      if (nights.value <= 0) {
        alert("Las fechas no son válidas");
        return;
      }

      // Guardar datos temporales
      localStorage.setItem('checkInDate', checkInDate.value);
      localStorage.setItem('checkOutDate', checkOutDate.value);
      localStorage.setItem('totalPrice', totalPrice.value);

      // Redirigir a pago
      router.push({ name: 'PaymentPage' });
    };

    return {
      checkInDate,
      checkOutDate,
      nights,
      totalPrice,
      room,
      goToPayment
    };
  }
};
</script>

<style>
.mb-6{
  color: black;
}
</style>