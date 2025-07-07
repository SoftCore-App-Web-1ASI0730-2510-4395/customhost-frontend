<!-- src/app/guest-experience/components/guest/iot-device-preference.component.vue -->
<template>
  <div class="device-card surface-card p-3 border-round shadow-1">
    <!-- Nombre del dispositivo -->
    <div class="flex align-items-center justify-content-between mb-3">
      <span class="font-bold text-lg">{{ device.name }}</span>
      <pv-badge :value="device.status" :severity="getBadgeSeverity(device.status)" />
    </div>

    <!-- Configuraciones visuales del dispositivo -->
    <ul class="configuration-list list-none p-0 m-0">
      <li v-if="device.type === 'ac'" class="mb-3 pb-2 border-bottom-1">
        <i class="pi pi-snowflake mr-2"></i>
        <strong>Temperatura:</strong> {{ device.preferences?.temperature || 22 }}°C
      </li>
      <li v-if="device.type === 'light'" class="mb-3 pb-2 border-bottom-1">
        <i class="pi pi-lightbulb mr-2"></i>
        <strong>Brillo:</strong> {{ device.preferences?.brightness || 50 }}%
      </li>
      <li v-if="device.type === 'tv'" class="mb-3 pb-2 border-bottom-1">
        <i class="pi pi-tv mr-2"></i>
        <strong>Canal:</strong> {{ device.preferences?.channel || 1 }}
      </li>
      <li v-if="device.type === 'speaker'" class="mb-3 pb-2 border-bottom-1">
        <i class="pi pi-volume-up mr-2"></i>
        <strong>Volumen:</strong> {{ device.preferences?.volume || 50 }}%
      </li>
      <li v-if="device.type === 'curtain'" class="mb-3 pb-2 border-bottom-1">
        <i class="pi pi-sliders-h mr-2"></i>
        <strong>Apertura:</strong> {{ device.preferences?.open || 0 }}%
      </li>
      <li class="mb-3 pb-2 border-bottom-1">
        <i class="pi pi-power-off mr-2"></i>
        <strong>Estado:</strong> {{ (device.preferences?.status || 'off') | capitalize }}
      </li>
      <li v-if="!device.type" class="text-sm text-gray-500">
        Este dispositivo no tiene configuraciones disponibles.
      </li>
    </ul>

    <!-- Modal de edición -->
    <pv-dialog v-model:visible="showEditModal" header="Editar Configuración" :modal="true">
      <IoTDeviceEditConfig
          :configKey="editingConfigKey"
          :device="device"
          @update="onUpdatePreference"
      />
      <template #footer>
        <pv-button label="Guardar" icon="pi pi-save" severity="success" @click="saveConfig" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IoTDeviceEditConfig from './iot-device-edit-config.component.vue';
import GuestRoomDeviceFacade from '../../services/guest/guest-room-device.facade.js';

const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
});

// Estado para el modal de edición
const showEditModal = ref(false);
const editingConfigKey = ref('');
const editedValue = ref(null);

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

// Instancia del facade
const facade = new GuestRoomDeviceFacade();

// Guardar cambios después de edición
const saveConfig = async () => {
  if (!editingConfigKey.value) return;
  // Actualiza la preferencia localmente
  props.device.preferences[editingConfigKey.value] = editedValue.value;
  // Guarda en backend
  await facade.saveRoomDevicePreference({
    userId: props.userId,
    deviceId: props.device.id,
    preferences: { ...props.device.preferences }
  });
  showEditModal.value = false;
};

// Recibe el valor editado del hijo
const onUpdatePreference = ({ key, value }) => {
  editedValue.value = value;
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