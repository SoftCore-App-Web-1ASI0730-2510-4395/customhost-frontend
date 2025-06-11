<template>
  <div>
    <h2>Room #105 - IoT Configuration</h2>

    <div class="add-form">
      <h3>Añadir nuevo dispositivo</h3>
      <form @submit.prevent="addRoomDevice">
        <label>Dispositivo IoT:</label>
        <select v-model="form.iotDeviceId" required>
          <option disabled value="">Selecciona un dispositivo</option>
          <option v-for="device in allIotDevices" :key="device.id" :value="device.id">
            {{ device.name }}
          </option>
        </select>

        <label>Estado:</label>
        <select v-model="form.status" required>
          <option value="working">Working</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit">Agregar dispositivo</button>
      </form>
    </div>

    <div v-for="item in roomDevices" :key="item.roomDevice.id" class="card">
      <p>
        <strong>{{ item.device.name }}</strong>
        <span class="status-tag">{{ item.roomDevice.status }}</span>
      </p>

      <form @submit.prevent="savePreferences(item)">
        <div v-for="(type, key) in item.device.configSchema" :key="key">
          <label>{{ key }}</label>

          <select v-if="Array.isArray(type)" v-model="item.preferences.preferences[key]">
            <option v-for="option in type" :value="option">{{ option }}</option>
          </select>

          <input v-else-if="type === 'number'" type="number" v-model.number="item.preferences.preferences[key]" />
        </div>
        <button type="submit">Guardar configuración</button>
      </form>
    </div>
  </div>
</template>

<script>
import { iotService } from '../services/iot.service.js'
import { RoomDevice } from '../model/room-device.entity.js';

export default {
  name: 'IotRoomConfiguration',
  data() {
    return {
      roomDevices: [],
      allIotDevices: [],
      form: {
        iotDeviceId: '',
        status: ''
      }
    };
  },
  async mounted() {
    await this.loadAll();
  },
  methods: {
    async loadAll() {
      this.roomDevices = await iotService.getRoomDevicesWithConfigs(105);
      this.allIotDevices = await iotService.getAllIotDevices();
      console.log('Dispositivos cargados:', this.allIotDevices);
    },
    async addRoomDevice() {
      const roomDevice = new RoomDevice(null, 105, this.form.iotDeviceId, this.form.status);
      await iotService.addRoomDevice(roomDevice);
      this.form.iotDeviceId = '';
      this.form.status = '';
      await this.loadAll();
    },
    async savePreferences(item) {
      await iotService.saveRoomDevicePreference(item.preferences);
      alert('Preferencias guardadas');
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}
.status-tag {
  font-size: 0.9em;
  color: white;
  background-color: #888;
  padding: 4px 8px;
  margin-left: 10px;
  border-radius: 4px;
}
.add-form {
  border: 1px dashed #aaa;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 8px;
  background: #f9f9f9;
}
</style>
