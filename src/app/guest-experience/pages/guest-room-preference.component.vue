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
                  <label class="device-config-label">
                    <i v-if="key === 'temperature'" class="pi pi-thermometer" style="color:#4f8cff; margin-right:4px;"></i>
                    <i v-else-if="key === 'brightness'" class="pi pi-sun" style="color:#f7b731; margin-right:4px;"></i>
                    <i v-else-if="key === 'color'" class="pi pi-palette" style="color:#a259f7; margin-right:4px;"></i>
                    <i v-else-if="key === 'volume'" class="pi pi-volume-up" style="color:#4f8cff; margin-right:4px;"></i>
                    <i v-else-if="key === 'power'" class="pi pi-power-off" style="color:#43a047; margin-right:4px;"></i>
                    <i v-else-if="key === 'state'" class="pi pi-lock" style="color:#607d8b; margin-right:4px;"></i>
                    <i v-else-if="key === 'apps'" class="pi pi-tablet" style="color:#00bcd4; margin-right:4px;"></i>
                    <i v-else-if="key === 'mode'" class="pi pi-cog" style="color:#607d8b; margin-right:4px;"></i>
                    <i v-else-if="key === 'fan_speed'" class="pi pi-wind" style="color:#90caf9; margin-right:4px;"></i>
                    <i v-else-if="key === 'input'" class="pi pi-video" style="color:#607d8b; margin-right:4px;"></i>
                    <i v-else class="pi pi-sliders-h" style="color:#607d8b; margin-right:4px;"></i>
                    {{ getFriendlyLabel(key) }}:
                  </label>
                  <!-- Slider para números -->
                  <template v-if="schema.type === 'number'">
                    <div class="slider-row">
                      <span v-if="key === 'temperature'" class="slider-extreme" style="color:#2196f3;"> <i class="pi pi-snowflake"></i> </span>
                      <span v-else-if="key === 'brightness'" class="slider-extreme" style="color:#222;"> <i class="pi pi-moon"></i> </span>
                      <input
                        type="range"
                        :min="schema.min ?? 0"
                        :max="schema.max ?? 100"
                        v-model.number="device.preferences[key]"
                        class="config-slider"
                        :style="key === 'temperature' ? 'background: linear-gradient(90deg, #2196f3, #f44336);' : (key === 'brightness' ? 'background: linear-gradient(90deg, #222, #f7b731);' : '')"
                      />
                      <span class="config-value" style="min-width:32px; text-align:right; font-weight:bold;">
                        {{ device.preferences[key] }}
                      </span>
                      <span v-if="key === 'temperature'" class="slider-extreme" style="color:#f44336;"> <i class="pi pi-fire"></i> </span>
                      <span v-else-if="key === 'brightness'" class="slider-extreme" style="color:#f7b731;"> <i class="pi pi-sun"></i> </span>
                    </div>
                  </template>
                  <!-- Select para enums -->
                  <template v-else-if="schema.type === 'enum'">
                    <select v-model="device.preferences[key]" class="config-select">
                      <option v-for="option in schema.values" :key="option" :value="option">{{ getFriendlyValue(key, option) }}</option>
                    </select>
                  </template>
                  <!-- Switch para booleanos -->
                  <template v-else-if="schema.type === 'boolean'">
                    <input type="checkbox" v-model="device.preferences[key]" class="config-switch" />
                  </template>
                  <!-- Input para texto -->
                  <template v-else-if="schema.type === 'string'">
                    <input type="text" v-model="device.preferences[key]" class="config-input" />
                  </template>
                  <!-- Array visual amigable -->
                  <template v-else-if="schema.type === 'array'">
                    <div class="array-options">
                      <span v-for="option in (schema.items || [])" :key="option" class="array-chip" :class="{selected: (device.preferences[key] || []).includes(option)}" @click="() => {
                        const arr = device.preferences[key] || [];
                        if (arr.includes(option)) device.preferences[key] = arr.filter(o => o !== option);
                        else device.preferences[key] = [...arr, option];
                      }">
                        <i class="pi pi-check-circle" v-if="(device.preferences[key] || []).includes(option)" style="color:#43a047; margin-right:2px;"></i>
                        {{ getFriendlyValue(key, option) }}
                      </span>
                    </div>
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
import axios from 'axios';

const facade = new GuestRoomDeviceFacade();

const userId = 1;

const roomsWithDevices = ref([]);
const loading = ref(true);
const showEditModal = ref(false);
const editRoomData = ref({});
const message = ref(null);
const iotDevices = ref([]);

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

const fetchIoTDevices = async () => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/io-t-devices`);
    iotDevices.value = resp.ok ? await resp.json() : [];
  } catch (e) {
    iotDevices.value = [];
  }
};

function getDeviceId(device) {
  // Busca el deviceId real usando ioTDeviceId o roomDeviceId
  return device.deviceId || device.ioTDeviceId || device.roomDeviceId || device.id;
}

function getDefaultValueFromSchema(schema) {
  if (schema.type === 'number') return schema.min ?? 0;
  if (schema.type === 'boolean') return false;
  if (schema.type === 'enum') return schema.values?.[0] ?? '';
  if (schema.type === 'array') return [];
  if (schema.type === 'string') return '';
  return null;
}

function getDefaultPreferences(configSchema, currentPrefs = {}) {
  const defaults = {};
  for (const key in configSchema) {
    const schema = configSchema[key];
    if (currentPrefs[key] !== undefined) {
      defaults[key] = currentPrefs[key];
    } else {
      defaults[key] = getDefaultValueFromSchema(schema);
    }
  }
  return defaults;
}

const handleEditRoomConfig = async (roomWithDevices) => {
  // Asegúrate de tener los IoT devices cargados
  if (!iotDevices.value.length) await fetchIoTDevices();
  editRoomData.value = {
    id: roomWithDevices.id,
    roomNumber: roomWithDevices.roomNumber,
    devices: Array.isArray(roomWithDevices.devices)
      ? roomWithDevices.devices.map(d => {
          // Busca el IoT device para obtener el configSchema real
          const iotDevice = iotDevices.value.find(dev => dev.id === d.ioTDeviceId || dev.id === d.deviceId || dev.id === d.roomDeviceId || dev.id === d.id);
          let configSchema = {};
          try {
            configSchema = iotDevice && iotDevice.configSchema ? JSON.parse(iotDevice.configSchema) : {};
          } catch (e) {}
          return {
            ...d,
            deviceId: getDeviceId(d),
            configSchema,
            preferences: getDefaultPreferences(configSchema, d.preferences || {})
          };
        })
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
    const updatePromises = (editRoomData.value.devices || []).map(async d => {
      const preferenceId = d.preferenceId || d.id;
      const deviceId = d.deviceId;
      const customName = d.customName || d.name || null;
      let overrides = null;
      try {
        overrides = d.preferences ? JSON.stringify(d.preferences) : null;
      } catch (e) {
        console.error('Error serializando overrides:', d.preferences, e);
      }
      // Validaciones y log
      if (!preferenceId || typeof preferenceId !== 'number') {
        console.error('Falta preferenceId o no es número:', d);
        return;
      }
      if (!deviceId || typeof deviceId !== 'number') {
        console.error('Falta deviceId o no es número:', d);
        return;
      }
      const payload = {
        userId: userId,
        deviceId,
        customName,
        overrides
      };
      console.log('Intentando PUT:', {
        url: `${import.meta.env.VITE_API_BASE_URL}/api/v1/user-device-preferences/${preferenceId}`,
        payload
      });
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user-device-preferences/${preferenceId}`,
        payload
      );
    });
    await Promise.all(updatePromises);
    showMessage('Configuración guardada correctamente.', 'success');
    showEditModal.value = false;
    await loadUserRoomsAndDevices();
  } catch (error) {
    showMessage('Error al guardar la configuración.', 'error');
    console.error('Error al guardar preferencias:', error);
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

function getDisplayValue(key, value) {
  // Limpia el key para mostrarlo bonito
  const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  if (Array.isArray(value)) {
    // Mostrar arrays como texto plano separado por coma
    return value.length
      ? value.map(v => getFriendlyValue(key, v)).join(', ')
      : 'Ninguno';
  }
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (value === null || value === undefined || value === '') {
    return 'Sin valor';
  }
  let cleanValue = String(getFriendlyValue(key, value)).replace(/_/g, ' ');
  cleanValue = cleanValue.replace(/%/g, '').replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '');
  if (key === 'currentValue' || key === 'temperature') {
    let temp = parseFloat(cleanValue);
    let color = '#4f8cff';
    let icon = 'pi pi-thermometer';
    if (!isNaN(temp)) {
      if (temp <= 18) {
        color = '#2196f3';
        icon = 'pi pi-snowflake';
      } else if (temp >= 26) {
        color = '#f44336';
        icon = 'pi pi-fire';
      } else {
        color = '#f7b731';
        icon = 'pi pi-thermometer';
      }
    }
    return `${cleanValue}`;
  }
  return cleanValue;
}

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
  max-width: 540px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 900px) {
  .modal-content {
    max-width: 98vw;
    min-width: 0;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
  }
  .device-config-fields {
    max-width: 98vw;
    min-width: 0;
    width: 100%;
    padding: 0.7rem 0.3rem 0.7rem 0.3rem;
  }
  .config-slider {
    width: 100%;
    min-width: 80px;
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .modal-content {
    max-width: 100vw;
    min-width: 0;
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
  }
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
  color: #333 ; /* fuerza el color negro para todos los nombres de dispositivo, incluyendo entry door al hacer clic */
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
  gap: 1.2rem;
  margin-top: 0.7rem;
  padding: 1rem 1.2rem 1rem 1.2rem; /* menos padding */
  background: #f4f8fd;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(79, 140, 255, 0.07);
  border: 1.5px solid #e3eafc;
  max-width: 420px;
  min-width: 200px;
  width: 100%;
  align-self: center;
  align-items: flex-start;
}
.device-config-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.2rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px dashed #e3eafc;
}
.device-config-row:last-child {
  border-bottom: none;
}
.device-config-label {
  min-width: 120px;
  color: #4f8cff;
  font-size: 1.05rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.config-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 220px;
  max-width: 50%;
  min-width: 100px;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  transition: background 0.3s;
  margin: 0 8px;
  display: inline-block;
}
.config-slider:hover {
  background: #ccc;
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
.array-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.2rem;
}
.array-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  min-height: 36px;
  padding: 0.5rem 1.2rem;
  margin: 0;
  border-radius: 16px;
  background: linear-gradient(90deg, #e0e7ff 0%, #b2f7ef 100%);
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  border: 1.5px solid #b2f7ef;
  box-shadow: 0 2px 8px rgba(80, 180, 255, 0.08);
  cursor: pointer;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s, border 0.3s;
  outline: none;
  user-select: none;
}
.array-chip.selected {
  background: linear-gradient(90deg, #4f8cff 0%, #43e97b 100%);
  color: #fff;
  border: 1.5px solid #4f8cff;
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.18);
}

/* Scenes Entry Door grid 2x2 */
.scenes-entry-door-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
}
.modal-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(80,180,255,0.08);
  display: inline-flex;
  align-items: center;
}
.modal-btn.cancel {
  background: linear-gradient(90deg, #ff5f6d 0%, #ff7e5f 100%);
  color: #fff;
}
.modal-btn.cancel:hover {
  background: linear-gradient(90deg, #ff3c3c 0%, #ffb347 100%);
  color: #fff;
}
.modal-btn:not(.cancel) {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}
.modal-btn:not(.cancel):hover {
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  color: #fff;
}
</style>