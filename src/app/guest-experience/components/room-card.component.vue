<!-- src/app/guest-experience/components/guest/room-card.component.vue -->
<template>
  <div class="room-card surface-card p-4 border-round shadow-1">
    <!-- Nombre del cuarto y tipo -->
    <div class="flex justify-content-between align-items-center mb-3">
      <h3 class="text-xl font-bold m-0">
        {{ room.roomNumber ? 'Habitación ' + room.roomNumber : '' }} - {{ room.type }}
      </h3>
      <!-- Eliminado pv-badge de estado -->
    </div>

    <!-- Información del hotel -->
    <div class="hotel-info mb-3">
      <strong>Hotel:</strong> {{ hotelName || 'Desconocido' }}
    </div>

    <!-- Lista de dispositivos -->
    <p class="font-semibold mb-3 device-title-black">Tus Dispositivos:</p>
    <ul class="list-none p-0 m-0 device-list-flex">
      <li v-for="device in devices" :key="device.id" class="device-card">
        <div class="device-card-header">
          <i :class="getDeviceIcon(device.name)" class="device-icon" />
          <span class="device-name">{{ device.name }}</span>
        </div>
        <div class="device-config-fields">
          <div v-if="Object.keys(device.preferences || {}).length > 0">
            <div
              v-for="(value, key) in device.preferences"
              :key="key"
              class="device-config-row"
            >
              <span class="device-config-label">{{ getFriendlyLabel(device, key) }}:</span>
              <span class="device-config-value">
                <b>
                  <template v-if="key === 'currentValue' || key === 'temperature'">
                    <span :style="getTempStyle(value)" class="temp-value-visual">
                      {{ value }}
                      <i :class="getTempIcon(value)" :style="getTempStyle(value, true)" class="ml-1"></i>
                    </span>
                  </template>
                  <template v-else-if="key === 'brightness'">
                    <span class="brightness-value-visual">
                      <i :class="'pi pi-sun mr-1'" :style="getBrightnessStyle(value)"></i>
                      <span :style="getBrightnessStyle(value)">{{ value }}</span>
                    </span>
                  </template>
                  <template v-else-if="isNumberValue(device, key)">
                    {{ value }}{{ getUnit(device, key) }}
                  </template>
                  <template v-else>
                    {{ getFriendlyValue(device, key, value) }}
                  </template>
                </b>
              </span>
            </div>
          </div>
          <div v-else class="device-config-row">
            <span class="device-config-label text-gray-500">Sin configuración</span>
          </div>
        </div>
      </li>
      <li v-if="!(devices && devices.length)" class="device-item-empty">
        <span>No hay dispositivos IoT en esta habitación.</span>
      </li>
    </ul>
    <!-- Botón para editar configuración -->
    <div class="flex justify-content-end mt-4">
      <button class="edit-config-btn" @click="onEditConfig">
        <i class="pi pi-cog mr-2"></i> Editar configuración
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue';

const props = defineProps({
  room: Object,
  devices: Array,
  hotelName: String,
  userId: [String, Number]
});
const emit = defineEmits(['edit-room-config']);

// El hotel ya viene como prop, no usar lista fija
// const hotel = computed(() => props.hotel || {});

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

// Al hacer clic en editar configuración, emite evento al padre
const onEditConfig = () => {
  emit('edit-room-config', { ...props.room, devices: props.devices });
};


// Etiquetas amigables por tipo de dispositivo y clave
const friendlyLabels = {
  'Temperature Sensor': {
    currentValue: 'Temperatura',
    unit: 'Unidad'
  },
  'Smart Light': {
    brightness: 'Brillo',
    color: 'Color'
  },
  'Smart TV': {
    volume: 'Volumen',
    power: 'Estado',
    apps: 'App',
    channel: 'Canal',
    brightness: 'Brillo',
    color: 'Color'
  },
  'Automatic Curtains': {
    position: 'Apertura',
    state: 'Estado'
  },
  'Ambient Sound System': {
    volume: 'Volumen',
    source: 'Fuente',
    power: 'Estado'
  },
  'Room Camera': {
    resolution: 'Resolución',
    recording: 'Grabación'
  },
  'Smart Fragrance Diffuser': {
    intensity: 'Intensidad',
    scent: 'Aroma',
    power: 'Estado'
  }
};

// Unidades por clave
const unitMapping = {
  currentValue: '°C',
  brightness: '%',
  volume: '%',
  position: '%',
  intensity: '%'
};

// Devuelve si el valor es numérico y debe mostrarse con unidad
const isNumberValue = (device, key) => {
  // Si la clave es conocida como numérica
  return ['currentValue', 'brightness', 'volume', 'position', 'intensity', 'channel'].includes(key) && typeof device.preferences[key] === 'number';
};

// Devuelve la unidad para la clave
const getUnit = (device, key) => {
  return unitMapping[key] || '';
};

// Devuelve una etiqueta amigable para la clave
const getFriendlyLabel = (device, key) => {
  // Si hay una etiqueta amigable, úsala
  if (friendlyLabels[device.name] && friendlyLabels[device.name][key]) {
    return friendlyLabels[device.name][key];
  }
  // Si no, convierte snake_case a Capitalizado
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Devuelve un valor amigable para valores no numéricos
const getFriendlyValue = (device, key, value) => {
  if (key === 'power' || key === 'status' || key === 'state' || key === 'recording') {
    // Estado en español
    const map = {
      on: 'Encendido',
      off: 'Apagado',
      auto: 'Automático',
      working: 'Funcionando',
      inactive: 'Inactivo',
      open: 'Abierto',
      close: 'Cerrado'
    };
    return map[value] || value;
  }
  // Si es string, limpia snake_case
  if (typeof value === 'string') {
    // Si es un array serializado, límpialo visualmente
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const arr = JSON.parse(value.replace(/'/g, '"'));
        if (Array.isArray(arr)) {
          return arr.map(v => String(v).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ');
        }
      } catch (e) {}
    }
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  // Si es array real
  if (Array.isArray(value)) {
    return value.map(v => String(v).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ');
  }
  return value;
};

// Filtro para capitalizar

// Agrega función para iconos PrimeVue
const getDeviceIcon = (deviceName) => {
  switch (deviceName) {
    case 'Temperature Sensor':
      return 'pi pi-thermometer';
    case 'Smart Light':
      return 'pi pi-sun';
    case 'Smart TV':
      return 'pi pi-desktop';
    case 'Automatic Curtains':
      return 'pi pi-sliders-h';
    case 'Ambient Sound System':
      return 'pi pi-volume-up';
    case 'Room Camera':
      return 'pi pi-video';
    case 'Smart Fragrance Diffuser':
      return 'pi pi-star';
    default:
      return 'pi pi-cog';
  }
};

// Estilo dinámico para temperatura
function getTempStyle(value, icon = false) {
  let color = '#4f8cff';
  if (typeof value === 'string') value = parseFloat(value);
  if (!isNaN(value)) {
    if (value <= 18) color = '#2196f3'; // azul frío
    else if (value >= 26) color = '#f44336'; // rojo calor
    else color = '#f7b731'; // amarillo templado
  }
  return icon ? `color: ${color}; font-size:1.2em; margin-left:4px;` : `color: ${color}; font-weight:bold; font-size:1.1em;`;
}
function getTempIcon(value) {
  if (typeof value === 'string') value = parseFloat(value);
  if (!isNaN(value)) {
    if (value <= 18) return 'pi pi-snowflake';
    if (value >= 26) return 'pi pi-fire';
    return 'pi pi-thermometer';
  }
  return 'pi pi-thermometer';
}
// Estilo dinámico para brillo
function getBrightnessStyle(value) {
  if (typeof value === 'string') value = parseFloat(value);
  let color = '#f7b731';
  if (!isNaN(value)) {
    if (value < 33) color = '#b0b8c9'; // gris claro
    else if (value < 66) color = '#f7b731'; // amarillo medio
    else color = '#ffd600'; // amarillo intenso
  }
  return `color: ${color}; font-weight:bold; font-size:1.1em;`;
}
</script>

<script>
export default {
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
}
</script>

<style scoped>
.room-card {
  background: linear-gradient(135deg, #f7fbff 0%, #e3f0ff 100%);
  border-radius: 18px;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  box-shadow: 0 6px 24px rgba(79, 140, 255, 0.13), 0 1.5px 6px rgba(0,0,0,0.04);
  border: 1.5px solid #e3eaff;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
}
.room-card:hover {
  box-shadow: 0 12px 32px rgba(79, 140, 255, 0.18), 0 2px 8px rgba(0,0,0,0.06);
  transform: translateY(-4px) scale(1.012);
}

.hotel-info {
  font-size: 1rem;
  color: #4f8cff;
  margin-bottom: 1.1rem;
  font-weight: 500;
}

ul.list-none {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem;
  margin-bottom: 0.5rem;
}
li.mb-4.pb-3.border-bottom-1 {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(79,140,255,0.07);
  border: 1px solid #e3eaff;
  padding: 0.8rem 1rem 0.7rem 1rem;
  margin-bottom: 0;
  flex: 1 1 220px;
  min-width: 180px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
}
.device-list-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 0.5rem;
}
.device-card {
  background: linear-gradient(120deg, #fafdff 60%, #e3f0ff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(79,140,255,0.10);
  border: 1.5px solid #e3eaff;
  padding: 1rem 1.1rem 0.8rem 1.1rem;
  min-width: 180px;
  max-width: 250px;
  flex: 1 1 210px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  align-items: flex-start;
}
.device-card:hover {
  box-shadow: 0 8px 24px rgba(79,140,255,0.18);
  transform: translateY(-2px) scale(1.015);
}
.device-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}
.device-icon {
  font-size: 1.5rem;
  color: #4f8cff;
  margin-right: 0.2rem;
}

.device-name {
  font-weight: 600;
  color: #4f8cff;
  font-size: 1.08rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.device-config-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.1rem;
}
.device-config-label {
  color: #607d8b;
  font-size: 0.98rem;
  min-width: 80px;
}
.device-config-value {
  color: #222;
  font-size: 1.01rem;
  font-weight: 500;
}
.device-item-empty {
  color: #b0b8c9;
  font-style: italic;
  padding: 0.7rem 0;
  text-align: center;
  width: 100%;
}

/* Mejora visual para el título */
.text-xl.font-bold.m-0 {
  color: #2a3a5a;
  letter-spacing: 0.5px;
}

/* Badge de estado de habitación */
.pv-badge {
  font-size: 0.95rem;
  border-radius: 6px;
  padding: 0.25em 0.7em;
  font-weight: 600;
}

/* Ajuste de separación del botón */
.flex.justify-content-end.mt-4 {
  margin-top: 1.2rem;
}

.edit-config-btn {
  background: linear-gradient(90deg, #4f8cff 0%, #6edb8f 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 2.1rem;
  font-weight: bold;
  font-size: 1.08rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  box-shadow: 0 2px 12px rgba(79,140,255,0.13);
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  gap: 0.5rem;
}
.edit-config-btn:hover {
  background: linear-gradient(90deg, #6edb8f 0%, #4f8cff 100%);
  box-shadow: 0 6px 20px rgba(79,140,255,0.18);
  transform: translateY(-2px) scale(1.03);
}

.array-chip-inline {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #e0e7ff 0%, #b2f7ef 100%);
  color: #4f8cff;
  border-radius: 14px;
  padding: 0.18rem 0.8rem;
  margin: 0 0.25rem 0.25rem 0;
  font-size: 0.93rem;
  font-weight: 500;
  border: 1px solid #b6d6ff;
  box-shadow: 0 1px 3px rgba(79,140,255,0.07);
  transition: background 0.15s, color 0.15s;
}

.device-title-black {
  color: #222;
  font-weight: bold;
  font-size: 1.08rem;
}
.temp-value-visual {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
}
.brightness-value-visual {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
}
</style>