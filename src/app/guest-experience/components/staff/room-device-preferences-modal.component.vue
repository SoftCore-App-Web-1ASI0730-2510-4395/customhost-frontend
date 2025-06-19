<template>
  <div class="modal-backdrop" v-if="visible">
    <div class="modal">
      <button class="close-button" @click="onClose">×</button>
      <h3>{{ t('iot_room_configuration.settings') }}</h3>
      <p><strong>{{ t('iot_room_configuration.iot_device') }}:</strong> {{ device?.name }}</p>
      <p><strong>{{ t('iot_room_configuration.room') }} #{{ roomId }}</strong></p>
      <label>{{ t('iot_room_configuration.status') }}</label>
      <select v-model="form.status">
        <option value="working">{{ t('iot_room_configuration.working') }}</option>
        <option value="maintenance">{{ t('iot_room_configuration.maintenance') }}</option>
        <option value="inactive">{{ t('iot_room_configuration.inactive') }}</option>
      </select>
      <div class="preferences">
        <h4>{{ t('iot_room_configuration.device_config') }}</h4>
        <div v-for="(type, key) in computedConfigSchema" :key="key">
          <label>{{ key }}</label>
          <select v-if="Array.isArray(type)" v-model="form.preferences[key]">
            <option v-for="option in type" :key="option" :value="option">{{ option }}</option>
          </select>
          <input v-else-if="type === 'number'" type="number" v-model.number="form.preferences[key]" />
          <input v-else type="text" v-model="form.preferences[key]" />
        </div>
        <p v-if="Object.keys(computedConfigSchema).length === 0">{{ t('iot_room_configuration.no_devices') }}</p>
      </div>
      <div class="actions">
        <button @click="onClose">{{ t('iot_room_configuration.close') }}</button>
        <button @click="onSave">{{ t('iot_room_configuration.save_changes') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { RoomDeviceManagementFacade } from '../../services/room-device-management.facade.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  visible: Boolean,
  roomDeviceId: Number,
  roomId: Number,
  device: Object,
  status: String,
  preferences: Object
});

const computedConfigSchema = computed(() => props.device?.configSchema ?? {});
const emits = defineEmits(['close', 'updated']);

const form = ref({
  status: props.status,
  preferences: { ...props.preferences }
});

watch(
    () => props.device,
    (newDevice) => {
      form.value.status = props.status;
      form.value.preferences = { ...props.preferences };
      console.log("ConfigSchema:", props.device?.configSchema);
      console.log("Form prefs iniciales:", form.value.preferences);
    },
    { immediate: true }
);

const onClose = () => emits('close');

const onSave = async () => {
  await RoomDeviceManagementFacade.updateRoomDeviceStatus(props.roomDeviceId, form.value.status);
  await RoomDeviceManagementFacade.saveRoomDevicePreference({
    roomDeviceId: props.roomDeviceId,
    preferences: form.value.preferences
  });
  emits('updated');
  emits('close');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  color: #000000;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: #000000;
  font-size: 20px;
  cursor: pointer;
}

.modal h3 {
  margin-bottom: 12px;
}

.modal p {
  margin: 8px 0;
  font-size: 14px;
}

.modal label {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  display: block;
}

.modal select,
.modal input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #fff;
  color: #333;
  margin-bottom: 8px;
}

.preferences {
  margin-top: 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.actions button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.actions button:first-child {
  background-color: transparent;
  color: #ccc;
}

.actions button:last-child {
  background-color: #00c48c;
  color: white;
}

.actions button:last-child:hover {
  background-color: #00a073;
}
</style>
