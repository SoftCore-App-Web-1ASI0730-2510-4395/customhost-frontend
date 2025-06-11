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
import { getRooms, deleteRoom, createRoom, updateRoom } from '../services/rooms-list.service.js'
import RoomsListTable from '../components/rooms-list-table.component.vue'
import RoomsListForm from '../components/rooms-list-form.component.vue'

const { t } = useI18n()
const rooms = ref([])
const roomDialog = ref(false)
const editingId = ref(null)

const roomForm = reactive({
  hotelId: '',
  number: '',
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
  Object.assign(roomForm, { hotelId: '', number: '', type: '', status: '', price: 0, floor: 1 })
  editingId.value = null
  roomDialog.value = true
}

const saveRoom = async () => {
  try {
    if (editingId.value) {
      const updated = await updateRoom(editingId.value, { ...roomForm })
      const index = rooms.value.findIndex(r => r.id === editingId.value)
      rooms.value[index] = updated
    } else {
      const created = await createRoom({ ...roomForm })
      rooms.value.push(created)
    }
    roomDialog.value = false
  } catch (error) {
    console.error('Error saving room:', error.message)
  }
}

onMounted(fetchRooms)
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