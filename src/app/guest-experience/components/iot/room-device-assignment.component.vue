<template>
  <div>
    <button class="add-device-button" @click="showModal = true">
      <span class="pi pi-plus" style="margin-right: 8px"></span>
      Add IoT Device to Room
    </button>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <button class="close-button" @click="showModal = false">×</button>

        <h3>Añadir nuevo dispositivo</h3>
        <form @submit.prevent="handleNext">
          <label>Habitación:</label>
          <select v-model="form.roomId" required>
            <option disabled value="">Selecciona una habitación</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              Habitación {{ room.number }}
            </option>
          </select>

          <label>Dispositivo IoT:</label>
          <select v-model="form.iotDeviceId" required>
            <option disabled value="">Selecciona un dispositivo</option>
            <option v-for="device in availableDevices" :key="device.id" :value="device.id">
              {{ device.name }} ({{ device.deviceType }})
            </option>
          </select>

          <label>Estado:</label>
          <select v-model="form.status" required>
            <option disabled value="">Selecciona un estado</option>
            <option value="working">Working</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit">Next</button>
        </form>

        <div v-if="selectedDeviceConfig">
          <h4>Configuración del dispositivo</h4>
          <form @submit.prevent="saveConfig">
            <div v-for="(type, key) in selectedDeviceConfig" :key="key">
              <label>{{ key }}</label>
              <select v-if="Array.isArray(type)" v-model="preferences[key]">
                <option v-for="option in type" :value="option">{{ option }}</option>
              </select>
              <input v-else-if="type === 'number'" type="number" v-model.number="preferences[key]" />
            </div>
            <button type="submit">Guardar configuración</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { roomDeviceService } from '../../services/room-device.service.js';
import { roomDevicePreferenceService } from '../../services/room-device-preference.service.js';
import * as roomService from '../../../crm/services/rooms.service.js';

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
  await roomDevicePreferenceService.saveRoomDeviceConfig(form.value, preferences.value);
  alert('Dispositivo configurado exitosamente');
  roomDeviceService.resetRoomDeviceForm(form.value, selectedDeviceConfig, preferences);
  emit('updated');
};

watch(() => form.value.roomId, async (roomId) => {
  if (roomId) {
    availableDevices.value = await roomDeviceService.getAvailableDevicesForRoom(roomId);
  } else {
    availableDevices.value = [];
  }
});

onMounted(async () => {
  rooms.value = await roomService.getRooms();
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

