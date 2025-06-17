<!-- src/app/guest-experience/components/guest/room-card.component.vue -->
<template>
  <div class="room-card surface-card p-4 border-round shadow-1">
    <!-- Información básica de la habitación -->
    <div class="flex justify-content-between align-items-center mb-3">
      <h3 class="text-xl font-bold m-0">
        {{ room.number }} - {{ room.type }}
      </h3>
      <pv-badge :value="room.status" :severity="getRoomStatusSeverity(room.status)" />
    </div>

    <!-- Información del hotel -->
    <div class="hotel-info mb-3">
      <strong>Hotel:</strong> {{ hotel.name }}
    </div>

    <!-- Lista de dispositivos -->
    <p class="font-semibold mb-3">Tus Dispositivos:</p>
    <ul class="list-none p-0 m-0">
      <li v-for="device in devices" :key="device.id" class="mb-4 pb-3 border-bottom-1">
        <IoTDevicePreference :device="device" :userId="userId" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import IoTDevicePreference from './iot-device-preference.component.vue';

const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  devices: {
    type: Array,
    default: () => []
  },
  userId: {
    type: Number,
    required: true
  }
});

// Obtiene el hotel asociado a esta habitación
const hotel = computed(() => {
  return hotels.find(hotel => hotel.id === props.room.hotelId) || {};
});

// Mapea severidad del estado de la habitación
const getRoomStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'success';
    case 'occupied':
      return 'warning';
    case 'cleaning':
      return 'info';
    default:
      return 'secondary';
  }
};

// Datos simulados de hoteles (usa tu servicio real)
const hotels = [
  { id: 1, name: "Hotel Sheraton Center" },
  { id: 2, name: "Barcelona Beach Resort" }
];
</script>

<style scoped>
.room-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.hotel-info {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}

.mb-3{
  color: black;
}
</style>