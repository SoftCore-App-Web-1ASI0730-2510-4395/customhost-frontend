<!-- src/app/guest-experience/components/guest/guest-room-preference.component.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <!-- Título principal -->
    <h2 class="text-3xl font-bold text-center mb-6">Configura tus Dispositivos IoT</h2>

    <!-- Cargando -->
    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <!-- Habitaciones con dispositivos -->
    <div v-else-if="roomsWithDevices.length > 0" class="grid gap-6">
      <div
        v-for="room in roomsWithDevices"
        :key="room.room.id"
        class="col-12 md:col-6 lg:col-4"
      >
        <RoomCardComponent
          :room="room.room"
          :devices="room.devices"
          :userId="userId"
          @save-room-iot-config="handleSaveRoomConfig(room.room, $event)"
        />
      </div>
    </div>

    <!-- Sin dispositivos -->
    <div v-else class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-info-circle text-6xl text-blue-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">No tienes habitaciones con dispositivos IoT disponibles.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RoomCardComponent from './room-card.component.vue';
import GuestRoomDeviceFacade from '../../services/guest-room-device.facade.js';

// Instancia del facade
const facade = new GuestRoomDeviceFacade();

// Datos del usuario
const userId = parseInt(localStorage.getItem('userId'), 10); // O desde route.params.userId

// Estados reactivos
const roomsWithDevices = ref([]);
const loading = ref(true);

// Cargar habitaciones y dispositivos del usuario
const loadUserRoomsAndDevices = async () => {
  loading.value = true;
  try {
    const data = await facade.getUserRoomsAndDevices(userId);
    roomsWithDevices.value = data.rooms || [];
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    loading.value = false;
  }
};

// Manejar el evento de guardar configuración de habitación
const handleSaveRoomConfig = async (room, devices) => {
  try {
    await facade.updateRoomPreferences(room.id, {
      temperature: room.temperature,
      devices
    });
    // Opcional: muestra mensaje visual
    alert('Configuración guardada correctamente.');
    await loadUserRoomsAndDevices();
  } catch (error) {
    alert('Error al guardar la configuración.');
    console.error(error);
  }
};

// Montaje inicial
onMounted(loadUserRoomsAndDevices);
</script>

<style scoped>
.surface-section {
  background-color: #f8f9fa;
}
.text-3xl {
  font-size: 1.875rem;
  color: #2c3e50;
}
</style>