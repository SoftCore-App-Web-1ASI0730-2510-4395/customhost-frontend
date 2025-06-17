<template>
  <div class="page-container">
    <h2>Configuración IoT por Habitación</h2>

    <room-device-assignment @updated="loadRoomsWithDevices" />

    <div class="rooms-grid">

      <iot-room-card
          v-for="room in roomsWithDevices.filter(r => r.devices && r.devices.length > 0)"
          :key="room.id"
          :room="room"
          @updated="loadRoomsWithDevices"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { roomDeviceService } from '../services/room-device.service';
import RoomDeviceAssignment from '../components/iot/room-device-assignment.component.vue';
import IotRoomCard from '../components/iot/iot-room-card.component.vue';

const roomsWithDevices = ref([]);

const loadRoomsWithDevices = async () => {
  roomsWithDevices.value = await roomDeviceService.getRoomsWithDevices();
  console.log('roomsWithDevices:', roomsWithDevices.value); // Depuración
};

onMounted(loadRoomsWithDevices);
</script>

<style scoped>

h2{
  color: black;
}
.page-container {
  padding: 24px;
}
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}
</style>
