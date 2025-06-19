<template>
  <div>
    <button class="add-device-button" @click="showModal = true">
      <span class="pi pi-plus" style="margin-right: 8px"></span>
      {{ t('iot_room_configuration.add_device') }}
    </button>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <button class="close-button" @click="showModal = false">×</button>

        <h3>{{ t('iot_room_configuration.add_device') }}</h3>
        <form @submit.prevent="handleNext">
          <label>{{ t('iot_room_configuration.room') }}:</label>
          <select v-model="form.roomId" required>
            <option disabled value="">{{ t('iot_room_configuration.select_room') }}</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ t('iot_room_configuration.room') }} {{ room.roomNumber }}
            </option>
          </select>

          <label>{{ t('iot_room_configuration.iot_device') }}:</label>
          <select v-model="form.iotDeviceId" required>
            <option disabled value="">{{ t('iot_room_configuration.select_device') }}</option>
            <option v-for="device in availableDevices" :key="device.id" :value="device.id">
              {{ device.name }} ({{ device.deviceType }})
            </option>
          </select>

          <label>{{ t('iot_room_configuration.status') }}:</label>
          <select v-model="form.status" required>
            <option disabled value="">{{ t('iot_room_configuration.select_status') }}</option>
            <option value="working">{{ t('iot_room_configuration.working') }}</option>
            <option value="maintenance">{{ t('iot_room_configuration.maintenance') }}</option>
            <option value="inactive">{{ t('iot_room_configuration.inactive') }}</option>
          </select>

          <button type="submit">{{ t('iot_room_configuration.next') }}</button>
        </form>

        <div v-if="selectedDeviceConfig">
          <h4>{{ t('iot_room_configuration.device_config') }}</h4>
          <form @submit.prevent="saveConfig">
            <div v-for="(type, key) in selectedDeviceConfig" :key="key">
              <label>{{ key }}</label>
              <select v-if="Array.isArray(type)" v-model="preferences[key]">
                <option v-for="option in type" :value="option">{{ option }}</option>
              </select>
              <input v-else-if="type === 'number'" type="number" v-model.number="preferences[key]" />
            </div>
            <button type="submit">{{ t('iot_room_configuration.save_config') }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RoomDeviceManagementFacade } from '../../services/room-device-management.facade.js';

const { t } = useI18n();

const emit = defineEmits(['updated']);

const showModal = ref(false);
const form = ref({ roomId: '', iotDeviceId: '', status: '' });
const rooms = ref([]);
const availableDevices = ref([]);
const selectedDeviceConfig = ref(null);
const preferences = ref({});

const handleNext = async () => {
  const device = availableDevices.value.find(d => d.id === form.value.iotDeviceId);
  selectedDeviceConfig.value = device?.configSchema ?? {};
  preferences.value = {};
};

const saveConfig = async () => {
  await RoomDeviceManagementFacade.saveRoomDeviceConfig(form.value, preferences.value);
  alert('Dispositivo configurado exitosamente');
  RoomDeviceManagementFacade.resetRoomDeviceForm(form.value, selectedDeviceConfig, preferences);
  emit('updated');
};

watch(() => form.value.roomId, async (roomId) => {
  if (roomId) {
    availableDevices.value = await RoomDeviceManagementFacade.getAvailableDevicesForRoom(roomId);
  } else {
    availableDevices.value = [];
  }
});

onMounted(async () => {
  rooms.value = await RoomDeviceManagementFacade.getRooms();
});
</script>

<style scoped>
.add-device-button {
  background-color: #00c48c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s ease;
  margin-bottom: 16px;
}

.add-device-button:hover {
  background-color: #00a073;
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.modal form label {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
}

.modal form select,
.modal form input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
  font-size: 14px;
}

.modal form button[type="submit"] {
  margin-top: 12px;
  align-self: flex-end;
  background-color: #00c48c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal form button[type="submit"]:hover {
  background-color: #00a073;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  color: #000000;
  position: relative;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: #000000;
  font-size: 24px;
  cursor: pointer;
}
</style>
