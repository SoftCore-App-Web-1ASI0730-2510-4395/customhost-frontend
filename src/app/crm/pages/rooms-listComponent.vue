<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0" style="color: black">{{ t('dashboard.rooms_management.rooms_management') }}</h2>
      <div class="hotel-title text-xl font-bold">
        Hotel Cheraton - {{ t('dashboard.rooms_management.rooms') }}
      </div>
      <Button label="Add Room" icon="pi pi-plus" @click="openNewRoomForm" />
    </div>

    <rooms-list-table
        :rooms="rooms"
        @edit="editRoom"
        @delete="deleteRoomById"
        @reserve="reserveRoom"
    />

    <rooms-list-form
        v-model:visible="roomDialog"
        :room="roomForm"
        :status-options="statusOptions"
        @save="saveRoom"
    />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRooms, deleteRoom, createRoom, updateRoom } from '../services/rooms.service.js'
import RoomsListTable from '../components/rooms-list-table.component.vue'
import RoomsListForm from '../components/rooms-list-form.component.vue'

const { t } = useI18n()
const rooms = ref([])
const roomDialog = ref(false)
const editingId = ref(null)

const roomForm = reactive({
  hotelId: '',
  roomNumber: '',
  type: '',
  status: '',
  price: 0,
  floor: 1
})

const statusOptions = ['Available', 'Occupied', 'Cleaning', 'Maintenance']

const fetchRooms = async () => {
  rooms.value = await getRooms()
}

const deleteRoomById = async (id) => {
  try {
    await deleteRoom(id)
    rooms.value = rooms.value.filter(r => r.id !== id)
  } catch (error) {
    console.error('Error deleting room:', error.message)
  }
}

const editRoom = (room) => {
  Object.assign(roomForm, room)
  editingId.value = room.id
  roomDialog.value = true
}

const openNewRoomForm = () => {
  Object.assign(roomForm, { hotelId: '', roomNumber: '', type: '', status: '', price: 0, floor: 1 })
  editingId.value = null
  roomDialog.value = true
}

const saveRoom = async () => {
  try {
    // Validación y conversión de tipos
    if (!roomForm.hotelId || !roomForm.roomNumber || !roomForm.type || !roomForm.status) {
      alert('Todos los campos son obligatorios.');
      return;
    }
    const payload = {
      ...roomForm,
      hotelId: Number(roomForm.hotelId),
      price: Number(roomForm.price),
      floor: Number(roomForm.floor)
    };
    if (editingId.value) {
      const updated = await updateRoom(editingId.value, payload)
      const index = rooms.value.findIndex(r => r.id === editingId.value)
      rooms.value[index] = updated
    } else {
      const created = await createRoom(payload)
      rooms.value.push(created)
    }
    roomDialog.value = false
  } catch (error) {
    console.error('Error saving room:', error.message)
    alert($t('roomsList.saveError') + ': ' + error.message)
  }
}

const reserveRoom = (room) => {
  // Guardar la habitación seleccionada (incluyendo price) en localStorage
  console.log('Habitación seleccionada para reservar:', room);
  console.log('Campo price de la habitación:', room.price);
  localStorage.setItem('selectedRoom', JSON.stringify(room));
  // Verificar lo que se guardó
  const savedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
  console.log('Habitación guardada en localStorage:', savedRoom);
  // Redirigir al flujo de pago (ajusta la ruta si es necesario)
  window.location.href = '/app/billing/pages/payment';
};

onMounted(async () => {
  try {
    const API_URL = import.meta.env.VITE_API_BASE_URL
    rooms.value = await getRooms()
  } catch (error) {
    console.error('Error al cargar habitaciones:', error)
  }
})
</script>

<style scoped>
.hotel-title {
  color: #1a237e;
  letter-spacing: 1px;
}
.text-primary {
  color: #2196f3;
}
</style>