<!-- src/app/guest-experience/components/guest/iot-device-edit-config.component.vue -->
<template>
  <div class="device-config surface-card p-3 border-round shadow-1">
    <!-- Configuración según tipo -->
    <div v-if="configKey in configSchema">
      <label>{{ configKey }}</label>
      <select v-if="Array.isArray(configSchema[configKey])" v-model="editedValue">
        <option v-for="option in configSchema[configKey]" :key="option" :value="option">{{ option }}</option>
      </select>
      <pv-input-number v-else-if="configSchema[configKey] === 'number'" v-model="editedValue" :min="0" :max="100" suffix="%" />
      <pv-input-text v-else v-model="editedValue" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  configKey: {
    type: String,
    required: true
  },
  device: {
    type: Object,
    required: true
  }
});

const configSchema = ref(props.device.configSchema || {});
const editedValue = ref(props.device.preferences[props.configKey]);

// Guardar cambios en el padre
defineEmits(['update']);
</script>

<style scoped>
.device-config {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.advanced-settings label {
  font-size: 0.85rem;
}
</style>