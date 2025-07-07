<template>
  <div class="device-config surface-card p-3 border-round shadow-1">
    <form @submit.prevent="emitUpdateAll">
      <div v-for="(schema, key) in configSchema" :key="key" class="config-field">
        <label class="config-label">{{ getFriendlyLabel(key) }}</label>
        <!-- Si es un número, slider -->
        <input
          v-if="schema === 'number'"
          type="range"
          :min="getMin(key)"
          :max="getMax(key)"
          v-model.number="editedValues[key]"
          class="config-slider"
        />
        <span v-if="schema === 'number'" class="config-value">{{ editedValues[key] }}{{ getUnit(key) }}</span>
        <!-- Si es un array, select -->
        <select v-else-if="Array.isArray(schema)" v-model="editedValues[key]" class="config-select">
          <option v-for="option in schema" :key="option" :value="option">{{ getFriendlyValue(key, option) }}</option>
        </select>
        <!-- Si es booleano, switch -->
        <input
          v-else-if="schema === 'boolean'"
          type="checkbox"
          v-model="editedValues[key]"
          class="config-switch"
        />
        <!-- Si es texto, input -->
        <input
          v-else
          type="text"
          v-model="editedValues[key]"
          class="config-input"
        />
      </div>
      <div class="flex justify-content-end mt-3">
        <button type="submit" class="modal-btn">Guardar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  configKey: String, // No se usa más, ahora es dinámico
  device: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

// Inicializa los valores editados con las preferencias actuales
const configSchema = computed(() => props.device.configSchema || {});
const editedValues = ref({});

watch(
  () => props.device,
  (newDevice) => {
    // Inicializa los valores editados con las preferencias actuales
    editedValues.value = {};
    for (const key in configSchema.value) {
      editedValues.value[key] = newDevice.preferences?.[key] ?? getDefaultValue(key, configSchema.value[key]);
    }
  },
  { immediate: true }
);

// Emitir todos los valores editados al guardar
const emitUpdateAll = () => {
  emit('update', { preferences: { ...editedValues.value } });
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

// Valor por defecto
const getDefaultValue = (key, schema) => {
  if (schema === 'number') {
    if (key === 'currentValue' || key === 'temperature') return 22;
    if (key === 'brightness' || key === 'volume' || key === 'position' || key === 'intensity') return 50;
    if (key === 'channel') return 1;
    return 0;
  }
  if (Array.isArray(schema)) return schema[0];
  if (schema === 'boolean') return false;
  return '';
};
</script>

<style scoped>
.device-config {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.config-field {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
.config-label {
  font-weight: 600;
  color: #4f8cff;
  margin-bottom: 0.3rem;
}
.config-slider {
  width: 100%;
  accent-color: #4f8cff;
}
.config-value {
  font-size: 1rem;
  font-weight: bold;
  color: #4f8cff;
  margin-top: 0.2rem;
}
.config-select {
  width: 100%;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #b0b0b0;
  background: #f5f7fa;
  font-size: 1rem;
}
.config-input {
  width: 100%;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #b0b0b0;
  font-size: 1rem;
}
.config-switch {
  width: 20px;
  height: 20px;
  accent-color: #4f8cff;
}
.modal-btn {
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
}
.modal-btn:hover {
  background: linear-gradient(90deg, #6edb8f 0%, #4f8cff 100%);
}
</style>
