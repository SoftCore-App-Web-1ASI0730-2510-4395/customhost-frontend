<!-- src/app/guest-experience/components/guest/room-card.component.vue -->
<template>
  <div class="room-card surface-card p-4 border-round shadow-1">
    <!-- Nombre del cuarto y tipo -->
    <div class="flex justify-content-between align-items-center mb-3">
      <h3 class="text-xl font-bold m-0">
        {{ room.roomNumber ? 'Habitación ' + room.roomNumber : '' }} - {{ room.type }}
      </h3>
      <pv-badge :value="room.status" :severity="getRoomStatusSeverity(room.status)" />
    </div>

    <!-- Información del hotel -->
    <div class="hotel-info mb-3">
      <strong>Hotel:</strong> {{ hotel.name }}
    </div>

    <!-- Lista de dispositivos -->
    <p class="font-semibold mb-3">Tus Dispositivos:</p>
    <ul class="list-none p-0 m-0">
      <li v-for="device in devices" :key="device.id" class="mb-4 pb-3 border-bottom-1">
        <div class="device-config-fields">
          <span class="device-name">{{ device.name }}</span>
          <!-- Mostrar configuración visual -->
          <div v-if="Object.keys(device.preferences || {}).length > 0">
            <div
                v-for="(value, key) in device.preferences"
                :key="key"
                class="device-config-row"
            >
              <span class="device-config-label">{{ getFriendlyLabel(device, key) }}:</span>
              <span class="device-config-value">
                <b>
                  <!-- Visualización amigable para valores numéricos -->
                  <template v-if="isNumberValue(device, key)">
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
  room: {
    type: Object,
    required: true
  },
  devices: {
    type: Array,
    default: () => []
  },
  userId: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(['edit-room-config']);

// Obtiene el hotel asociado a esta habitación
const hotel = computed(() => {
  return hotels.find(hotel => hotel.id === props.room.hotelId) || {};
});

// Mapea severidad del estado de la habitación
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

// Datos simulados de hoteles (usa tu servicio real)
const hotels = [
  { id: 1, name: "Hotel Sheraton Center" },
  { id: 2, name: "Barcelona Beach Resort" }
];

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
    channel: 'Canal'
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
  return (friendlyLabels[device.name] && friendlyLabels[device.name][key]) ? friendlyLabels[device.name][key] : key.charAt(0).toUpperCase() + key.slice(1);
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
  return value;
};

// Filtro para capitalizar
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
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.hotel-info {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
}

.mb-3{
  color: black;
}
.mb-4{
  color: black;
}

.edit-config-btn {
  background: linear-gradient(90deg, #4f8cff 0%, #6edb8f 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(79,140,255,0.08);
  display: flex;
  align-items: center;
}
.edit-config-btn:hover {
  background: linear-gradient(90deg, #6edb8f 0%, #4f8cff 100%);
  box-shadow: 0 4px 16px rgba(79,140,255,0.16);
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
.temp-slider {
  flex: 1;
  accent-color: #4f8cff;
  margin: 0 0.5rem;
}
.temp-value {
  font-size: 1rem;
  font-weight: bold;
  color: #4f8cff;
  margin-left: 0.5rem;
}
.device-item-empty {
  color: #aaa;
  font-style: italic;
  padding: 0.5rem 0;
}
</style>