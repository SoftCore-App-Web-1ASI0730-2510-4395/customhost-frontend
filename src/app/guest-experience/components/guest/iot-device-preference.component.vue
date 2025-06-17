<!-- src/app/guest-experience/components/guest/iot-device-preference.component.vue -->
<template>
  <div class="device-card surface-card p-3 border-round shadow-1">
    <!-- Nombre del dispositivo -->
    <div class="flex align-items-center justify-content-between mb-3">
      <span class="font-bold text-lg">{{ device.name }}</span>
      <pv-badge :value="device.status" :severity="getBadgeSeverity(device.status)" />
    </div>

    <!-- Configuraciones estáticas del dispositivo -->
    <ul class="configuration-list list-none p-0 m-0">
      <li v-for="(type, key) in device.configSchema" :key="key" class="mb-3 pb-2 border-bottom-1">
        <strong>{{ key }}:</strong>

        <!-- Botón de edición -->
        <button class="edit-button ml-2" @click="openEditModal(key)">
          <i class="pi pi-pencil"></i>
        </button>

        <!-- Si es array (opciones múltiples) -->
        <span v-if="Array.isArray(type)">
          {{ Array.isArray(device.preferences[key]) ? device.preferences[key].join(', ') : device.preferences[key] }}
        </span>

        <!-- Si es número -->
        <span v-else-if="type === 'number'">
          {{ device.preferences[key] }}{{ unitMapping[key] || '' }}
        </span>

        <!-- Otros tipos -->
        <span v-else>
          {{ device.preferences[key] }}
        </span>
      </li>

      <!-- Mensaje si no hay configuraciones -->
      <li v-if="Object.keys(device.configSchema).length === 0" class="text-sm text-gray-500">
        Este dispositivo no tiene configuraciones disponibles.
      </li>
    </ul>

    <!-- Modal de edición -->
    <pv-dialog v-model:visible="showEditModal" header="Editar Configuración" :modal="true">
      <IoTDeviceEditConfig :configKey="editingConfigKey" :device="device" />
      <template #footer>
        <pv-button label="Guardar" icon="pi pi-save" severity="success" @click="saveConfig" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IoTDeviceEditConfig from './iot-device-edit-config.component.vue';

const props = defineProps({
  device: {
    type: Object,
    required: true
  }
});

// Estado para el modal de edición
const showEditModal = ref(false);
const editingConfigKey = ref('');

// Mapea unidades o valores por defecto si son números
const unitMapping = {
  currentValue: '°C',
  brightness: '%',
  volume: '%',
  position: '%',
  intensity: '%'
};

// Determina color del badge según estado
const getBadgeSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'working':
      return 'success';
    case 'maintenance':
      return 'warning';
    case 'inactive':
      return 'danger';
    default:
      return 'secondary';
  }
};

// Abrir modal de edición
const openEditModal = (key) => {
  editingConfigKey.value = key;
  showEditModal.value = true;
};

// Guardar cambios después de edición
const saveConfig = async () => {
  // Lógica para guardar preferencias actualizadas
  alert('Preferencia guardada');
  showEditModal.value = false;
};
</script>

<style scoped>
.device-card {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.configuration-list li {
  padding-bottom: 0.5rem;
}

.text-lg {
  font-size: 1.1rem;
}

.edit-button {
  background-color: transparent;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  font-size: 1.2rem;
}

.edit-button:hover {
  color: #007bff;
}

.mb-3{
  color: #2c3e50;
}
</style>