<!-- src/app/guest-experience/pages/iot-preferences.component.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <!-- Título principal -->
    <h2 class="text-3xl font-bold text-center mb-6">Configura tus Dispositivos IoT</h2>

    <!-- Mensaje visual -->
    <div v-if="message" class="notification-box" :class="message.type">
      {{ message.text }}
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <!-- Mensaje de inicio de sesión -->
    <div v-if="!userId" class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-user text-6xl text-orange-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">Inicia sesión, por favor.</span>
    </div>

    <!-- Habitaciones con dispositivos -->
    <div v-else-if="roomsWithDevices.length > 0" class="grid gap-6">
      <div v-for="room in roomsWithDevices" :key="room.room.id" class="col-12 md:col-6 lg:col-4">
        <RoomCardComponent
            :room="room.room"
            :devices="room.devices"
            :hotel="room.hotel"
            :userId="userId"
            @edit-room-config="handleEditRoomConfig"
        />
      </div>
    </div>

    <!-- Sin dispositivos -->
    <div v-else class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-info-circle text-6xl text-blue-500 mb-3"></i>
      <span class="text-xl text-center text-gray-600">No tienes habitaciones con dispositivos IoT disponibles.</span>
    </div>

    <!-- Modal visual para editar configuración -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">
          Configura tu habitación
          <span v-if="editRoomData.roomNumber" class="room-name"> - Habitación {{ editRoomData.roomNumber }}</span>
        </h3>
        <div class="modal-section">
          <label class="modal-label">Dispositivos IoT:</label>
          <ul class="device-list">
            <li v-for="device in editRoomData.devices || []" :key="device.roomDeviceId || device.id" class="device-item">
              <span class="device-name">{{ device.name }}</span>
              <div class="device-config-fields">
                <div v-for="(schema, key) in device.configSchema" :key="key" class="device-config-row">
                  <label class="device-config-label">{{ getFriendlyLabel(key) }}:</label>
                  <!-- Slider para números -->
                  <template v-if="schema === 'number'">
                    <input
                        type="range"
                        :min="getMin(key)"
                        :max="getMax(key)"
                        v-model.number="device.preferences[key]"
                        class="config-slider"
                    />
                    <span class="config-value">{{ device.preferences[key] }}{{ getUnit(key) }}</span>
                  </template>
                  <!-- Select para arrays -->
                  <template v-else-if="Array.isArray(schema)">
                    <select v-model="device.preferences[key]" class="config-select">
                      <option v-for="option in schema" :key="option" :value="option">{{ getFriendlyValue(key, option) }}</option>
                    </select>
                  </template>
                  <!-- Switch para booleanos -->
                  <template v-else-if="schema === 'boolean'">
                    <input type="checkbox" v-model="device.preferences[key]" class="config-switch" />
                  </template>
                  <!-- Input para texto -->
                  <template v-else>
                    <input type="text" v-model="device.preferences[key]" class="config-input" />
                  </template>
                </div>
              </div>
            </li>
            <li v-if="!(editRoomData.devices && editRoomData.devices.length)" class="device-item-empty">
              <span>No hay dispositivos IoT en esta habitación.</span>
            </li>
          </ul>
        </div>
        <div class="flex justify-content-end mt-3">
          <button class="modal-btn mr-2" @click="saveRoomConfig">Guardar</button>
          <button class="modal-btn cancel" @click="closeEditModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RoomCardComponent from '../components/guest/room-card.component.vue';
import GuestRoomDeviceFacade from '../services/guest/guest-room-device.facade.js';
import { RoomDeviceManagementFacade } from '../services/room-device-management.facade.js';
import { getRoomsForUser } from '../../crm/services/booking.service.js';

const facade = new GuestRoomDeviceFacade();

const userId = 1;

const roomsWithDevices = ref([]);
const loading = ref(true);
const showEditModal = ref(false);
const editRoomData = ref({});
const message = ref(null);

const loadUserRoomsAndDevices = async () => {
  loading.value = true;
  try {
    // 1. Obtener solo las habitaciones del usuario
    const allRooms = await getRoomsForUser(userId);
    // 2. Para cada habitación, obtener hotel y devices enriquecidos
    const result = [];
    for (const room of allRooms) {
      let hotel = {};
      if (room.hotelId) {
        try {
          const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/hotel/${room.hotelId}`);
          hotel = resp.ok ? await resp.json() : {};
        } catch (e) {
          console.error('Error obteniendo hotel:', e);
          hotel = {};
        }
      }
      const devices = await RoomDeviceManagementFacade.getDevicesWithUserPreferences(room.id, userId);
      result.push({ room, hotel, devices });
    }
    roomsWithDevices.value = result;
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    loading.value = false;
  }
};

const handleEditRoomConfig = (room) => {
  // Clona dispositivos y asegura que tengan preferencias inicializadas
  editRoomData.value = {
    id: room.id,
    roomNumber: room.roomNumber,
    devices: (room.devices && room.devices.length)
        ? room.devices.map(d => ({
          ...d,
          preferences: { ...d.preferences },
        }))
        : []
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editRoomData.value = {};
};

const showMessage = (text, type = 'success') => {
  message.value = { text, type };
  setTimeout(() => {
    message.value = null;
  }, 2500);
};

const saveRoomConfig = async () => {
  try {
    await facade.updateRoomPreferences(editRoomData.value.id, {
      devices: editRoomData.value.devices.map(d => ({
        roomDeviceId: d.roomDeviceId,
        preferences: { ...d.preferences }
      }))
    });
    showMessage('Configuración guardada correctamente.', 'success');
    showEditModal.value = false;
    await loadUserRoomsAndDevices();
  } catch (error) {
    showMessage('Error al guardar la configuración.', 'error');
    console.error(error);
  }
};

// Etiquetas amigables
const friendlyLabels = {
  currentValue: 'Temperatura',
  unit: 'Unidad',
  brightness: 'Brillo',
  color: 'Color',
  state: 'Estado',
  position: 'Apertura',
  apps: 'App',
  volume: 'Volumen',
  power: 'Encendido',
  channel: 'Canal',
  resolution: 'Resolución',
  recording: 'Grabación',
  source: 'Fuente',
  intensity: 'Intensidad',
  scent: 'Aroma'
};
const getFriendlyLabel = (key) => friendlyLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);

// Valores amigables para selects
const friendlyValues = {
  on: 'Encendido',
  off: 'Apagado',
  open: 'Abierto',
  close: 'Cerrado',
  working: 'Funcionando',
  inactive: 'Inactivo',
  auto: 'Automático'
};
const getFriendlyValue = (key, value) => friendlyValues[value] || value;

// Unidades por clave
const unitMapping = {
  currentValue: '°C',
  brightness: '%',
  volume: '%',
  position: '%',
  intensity: '%'
};
const getUnit = (key) => unitMapping[key] || '';

// Rango por clave
const getMin = (key) => {
  if (key === 'currentValue' || key === 'temperature') return 16;
  if (key === 'brightness' || key === 'volume' || key === 'position' || key === 'intensity') return 0;
  if (key === 'channel') return 1;
  return 0;
};
const getMax = (key) => {
  if (key === 'currentValue' || key === 'temperature') return 30;
  if (key === 'brightness' || key === 'volume' || key === 'position' || key === 'intensity') return 100;
  if (key === 'channel') return 999;
  return 100;
};

onMounted(async () => {
  console.log('Montando guest-room-preference.component.vue');
  await loadUserRoomsAndDevices();
  console.log('roomsWithDevices después de cargar:', roomsWithDevices.value);
});
</script>

<style scoped>
.surface-section {
  background-color: #f9fafb;
}
.text-3xl {
  font-size: 1.875rem;
  color: #2c3e50;
}
.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.mb-3 {
  margin-bottom: 1rem;
}
.font-semibold {
  font-weight: 600;
}
.text-gray-600 {
  color: #6b7280;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 350px;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative;
}
.modal-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  color: #2c3e50;
  text-align: center;
}
.modal-section {
  margin-bottom: 1.2rem;
}
.modal-label {
  font-weight: 600;
  color: #4f8cff;
  margin-bottom: 0.3rem;
  display: block;
}
.input-modal {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #b0b0b0;
  margin-top: 0.2rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.temp-slider-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.temp-slider {
  flex: 1;
  accent-color: #4f8cff;
  margin: 0 0.5rem;
}
.temp-label {
  font-size: 0.95rem;
  color: #888;
}
.temp-value {
  font-size: 1rem;
  font-weight: bold;
  color: #4f8cff;
  margin-left: 0.5rem;
}
.device-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.device-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.device-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}
.device-status-select {
  border-radius: 6px;
  border: 1px solid #b0b0b0;
  padding: 0.2rem 0.7rem;
  font-size: 1rem;
  background: #f5f7fa;
}
.device-item-empty {
  color: #aaa;
  font-style: italic;
  padding: 0.5rem 0;
}
.device-config-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.3rem;
}
.device-config-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.device-config-label {
  min-width: 70px;
  color: #4f8cff;
  font-size: 0.98rem;
  font-weight: 500;
}
.light-slider {
  flex: 1;
  accent-color: #f7b731;
  margin: 0 0.5rem;
}
.notification-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}
.notification-box.success {
  background-color: #4CAF50;
}
.notification-box.error {
  background-color: #F44336;
}
@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.room-name {
  font-size: 1rem;
  color: #4f8cff;
  font-weight: 500;
}
.config-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  transition: background 0.3s;
}
.config-slider:hover {
  background: #ccc;
}
.config-value {
  font-size: 0.9rem;
  color: #333;
  margin-left: 0.5rem;
}
.config-select, .config-switch, .config-input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #b0b0b0;
  margin-top: 0.2rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.config-switch {
  width: auto;
}
</style>