<!-- src/app/guest-experience/pages/guest-room-preference.component.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Personaliza tus Dispositivos IoT</div>

    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <div v-else-if="room && devices.length > 0" class="card p-4 shadow-1 border-round-lg">
      <h3 class="mb-4">Habitación {{ room.number }} - {{ room.type }}</h3>
      <p class="text-lg mb-4">Piso: {{ room.floor }}</p>

      <div class="grid">
        <div v-for="device in devices" :key="device.id" class="col-12 md:col-6 lg:col-4">
          <IoTDevicePreference
              :device="device"
              :userId="userId"
          />
        </div>
      </div>
    </div>

    <div v-else class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-info-circle text-6xl text-blue-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">No hay dispositivos disponibles en esta habitación.</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import GuestRoomDeviceFacade from '../services/guest-room-device.facade.js';
import IoTDevicePreference from '../components/guest/iot-device-preference.component.vue';

export default {
  components: { IoTDevicePreference },
  setup() {
    const facade = new GuestRoomDeviceFacade();
    const route = useRoute();

    const roomId = parseInt(route.params.roomId, 10);
    const userId = parseInt(route.params.userId, 10);
    const room = ref(null);
    const devices = ref([]);
    const loading = ref(true);

    const loadRoomAndDevices = async () => {
      loading.value = true;
      try {
        const { room: fetchedRoom, devices: fetchedDevices } = await facade.getRoomWithDevices(roomId);
        room.value = fetchedRoom;
        devices.value = fetchedDevices.map((d) => ({
          ...d,
          customName: '',
          overrides: {}
        }));
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadRoomAndDevices();
    });

    return {
      room,
      devices,
      loading,
      userId
    };
  }
};
</script>

<style scoped>
.surface-section {
  background-color: #f8f9fa;
}
.card {
  background-color: #ffffff;
}
.text-3xl {
  font-size: 1.875rem;
  color: #2c3e50;
}

</style>