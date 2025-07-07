<template>
  <div class="page-container">
    <h2>{{ t('iot_room_configuration.title') }}</h2>

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
import { useI18n } from 'vue-i18n';

import RoomDeviceAssignment from '../components/room-device-assignment.component.vue';
import IotRoomCard from '../components/iot-room-card.component.vue';
import { RoomDeviceManagementFacade } from '../services/room-device-management.facade.js';

const { t } = useI18n();

const roomsWithDevices = ref([]);

const loadRoomsWithDevices = async () => {
  roomsWithDevices.value = await RoomDeviceManagementFacade.getRoomsWithDevices();

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