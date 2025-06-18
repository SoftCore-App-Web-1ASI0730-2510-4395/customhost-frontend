<template>
  <div class="room-card">
    <div class="room-header">
      <h3>{{ t('iot_room_configuration.room') }} #{{ room.number }} - {{ room.type }}</h3>
      <span :class="['status-badge', room.status?.toLowerCase()]">{{ room.status }}</span>
    </div>
    <hr />
    <p class="devices-title">{{ t('iot_room_configuration.devices') }}</p>
    <ul class="device-list">
      <li v-for="device in room.devices" :key="device.roomDeviceId" class="device-item">
        <span class="device-icon pi pi-eye"></span>
        <span class="device-name">{{ device.name }}</span>
        <span :class="['device-status', device.status]">{{ t('iot_room_configuration.' + device.status) }}</span>
        <button class="settings-button" @click="openSettings(device)">
          <span class="pi pi-cog"></span>
        </button>
        <button class="delete-button" @click="deleteDevice(device.roomDeviceId)">
          <span class="pi pi-trash"></span>
        </button>
      </li>
      <li v-if="room.devices.length === 0" class="no-devices">{{ t('iot_room_configuration.no_devices') }}</li>
    </ul>
  </div>
  <RoomDevicePreferencesModalComponent
      v-if="selectedDevice"
      :visible="showModal"
      :roomDeviceId="selectedDevice.roomDeviceId"
      :roomId="room.id"
      :device="selectedDevice"
      :status="selectedDevice.status"
      :preferences="selectedDevice.preferences"
      @close="closeModal"
      @updated="$emit('updated')" />
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import RoomDevicePreferencesModalComponent from './room-device-preferences-modal.component.vue';
import { RoomDeviceManagementFacade } from '../../services/staff/room-device-management.facade.js';

const { t } = useI18n();

const props = defineProps({
  room: Object
});

const room = props.room; // ⬅️ ESTA LÍNEA ES LA CLAVE
const emit = defineEmits(['updated']);

const openSettings = async (device) => {
  console.log("Opening settings for device:", device);
  const preferences = await RoomDeviceManagementFacade.getPreferencesForRoomDevice(room.id, device.iotDeviceId);

  console.log("Loaded preferences:", preferences);
  selectedDevice.value = {
    ...device,
    preferences
  };
  showModal.value = true;
};

const deleteDevice = async (roomDeviceId) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este dispositivo?')) return;
  try {
    await RoomDeviceManagementFacade.deleteRoomDeviceAndPreferences(roomDeviceId);
    emit('updated'); // Recargar vista
  } catch (error) {
    console.error('Error eliminando dispositivo:', error);
    alert('No se pudo eliminar el dispositivo.');
  }
};

const selectedDevice = ref(null);
const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.room-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  color: #1e1e1e;
  margin-bottom: 20px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
}

.delete-button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.1em;
  margin-left: 4px;
}

.delete-button:hover {
  color: #ff4d4d;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  font-size: 0.8em;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: capitalize;
  font-weight: bold;
}

.status-badge.available {
  background-color: #007bff;
  color: white;
}

.status-badge.occupied {
  background-color: #ffc107;
  color: black;
}

.status-badge.cleaning {
  background-color: #17a2b8;
  color: white;
}

.devices-title {
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 6px;
}

.device-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.device-icon {
  font-size: 1.2em;
}

.device-name {
  flex: 1;
}

.device-status {
  font-size: 0.75em;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: lowercase;
}

.device-status.working {
  background-color: #28a745;
  color: white;
}

.device-status.maintenance {
  background-color: #ffc107;
  color: black;
}

.device-status.inactive {
  background-color: #8b0000;
  color: white;
}

.settings-button {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1.1em;
}

.no-devices {
  font-style: italic;
  color: #999;
}
</style>
