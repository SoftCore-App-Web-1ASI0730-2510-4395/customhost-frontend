<!-- src/app/guest-experience/components/iot-device-preference.component.vue -->
<template>
  <pv-card class="device-card shadow-2 transition-all transition-duration-300 hover:shadow-6">
    <template #title>
      <div class="flex align-items-center justify-content-between">
        {{ device.name }}
        <pv-badge :severity="getBadgeSeverity(device.status)">
          {{ device.status }}
        </pv-badge>
      </div>
    </template>
    <template #content>
      <div class="field">
        <label for="customName" class="block font-medium mb-2">Nombre Personalizado</label>
        <pv-input-text id="customName" v-model="customName" placeholder="Ej: Mi luz de lectura" class="w-full" />
      </div>

      <!-- Configuración avanzada por tipo -->
      <div v-if="device.deviceType === 'lighting'" class="advanced-settings mt-3">
        <label class="block font-medium mb-2">Ajustes de Luz</label>
        <div class="grid">
          <div class="col-6">
            <label>Brightness</label>
            <pv-input-number v-model="overrides.brightness" :min="0" :max="100" suffix="%" class="w-full" />
          </div>
          <div class="col-6">
            <label>Color</label>
            <pv-select v-model="overrides.color" :options="['warm', 'cool']" class="w-full" />
          </div>
        </div>
      </div>

      <div v-else-if="device.deviceType === 'climate'" class="advanced-settings mt-3">
        <label class="block font-medium mb-2">Ajustes de Temperatura</label>
        <div class="grid">
          <div class="col-6">
            <label>Temperatura</label>
            <pv-input-number v-model="overrides.temperature" :min="16" :max="30" suffix="°C" class="w-full" />
          </div>
          <div class="col-6">
            <label>Fan Speed</label>
            <pv-select v-model="overrides.fanSpeed" :options="['low', 'medium', 'high']" class="w-full" />
          </div>
        </div>
      </div>

      <pv-button label="Guardar Preferencia" icon="pi pi-save" class="mt-3 w-full" @click="savePreference" />
    </template>
  </pv-card>
</template>

<script>
import { ref } from 'vue';
import { saveUserDevicePreference } from '../../profiles/services/user-preference.service';

export default {
  props: {
    device: {
      type: Object,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const customName = ref(props.device.customName || '');
    const overrides = ref({ ...props.device.overrides });

    const savePreference = async () => {
      try {
        await saveUserDevicePreference({
          userId: props.userId,
          deviceId: props.device.id,
          customName: customName.value,
          overrides: overrides.value
        });
        // Mostrar notificación o feedback positivo
        alert('Preferencia guardada exitosamente');
      } catch (error) {
        console.error('Error al guardar preferencia:', error);
        alert('Hubo un error al guardar la preferencia.');
      }
    };

    const getBadgeSeverity = (status) => {
      switch (status) {
        case 'online':
          return 'success';
        case 'offline':
          return 'danger';
        default:
          return 'secondary';
      }
    };

    return {
      customName,
      overrides,
      savePreference,
      getBadgeSeverity
    };
  }
};
</script>

<style scoped>
.device-card {
  border-radius: 12px;
  padding: 1rem;
}

.advanced-settings label {
  font-size: 0.9rem;
  color: #555;
}
</style>