<!-- src/pages/HotelRoomSelectionPage.vue -->
<template>
  <div class="page-container p-4">
    <h2>Seleccione un Hotel y una Habitación</h2>

    <!-- Paso 1: Selección de Hotel -->
    <div class="mb-5">
      <h3>Hoteles Disponibles</h3>
      <pv-select-button v-model="selectedHotel" :options="hotels" option-label="name" @change="onHotelChange" />
    </div>

    <!-- Paso 2: Mostrar cuartos del hotel seleccionado -->
    <div v-if="selectedHotel" class="mt-4">
      <h3>Habitaciones Disponibles en {{ selectedHotel.name }}</h3>
      <div class="grid">
        <div v-for="room in availableRooms" :key="room.id">
          <pv-card
              class="room-card"
              :class="{ 'selected': selectedRoom && selectedRoom.id === room.id }"
              @click="onRoomSelected(room)"
          >
            <template #title>
              Habitación {{ room.number }} - {{ room.type }}
            </template>
            <template #content>
              <div class="flex align-items-center justify-content-between">
                <span><strong>Piso:</strong> {{ room.floor }}</span>
                <pv-badge :severity="getBadgeSeverity(room.status)">
                  {{ room.status }}
                </pv-badge>
              </div>
              <p class="mt-2"><strong>Precio:</strong> ${{ room.price }} USD</p>
            </template>
          </pv-card>
        </div>
      </div>
    </div>

    <!-- Botón siguiente si ya hay habitación seleccionada -->
    <div v-if="selectedRoom" class="mt-5">
      <pv-button label="Continuar al Pago" icon="pi pi-arrow-right" @click="goToPayment" />
    </div>

    <!-- Cargando -->
    <pv-progress-spinner v-if="loadingRooms" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getHotels } from '../../services/hotels.service';
import { getRoomsByHotelId } from '../../services/rooms.service';

  export default {
  setup() {
  const router = useRouter();
  const hotels = ref([]);
  const selectedHotel = ref(null);
  const rooms = ref([]);
  const availableRooms = computed(() => {
  return rooms.value.filter(room => room.isAvailable);
});
  const selectedRoom = ref(null);
  const loadingRooms = ref(false);

  // Cargar todos los hoteles
  const loadHotels = async () => {
  hotels.value = await getHotels();
};

  // Cargar habitaciones cuando se elija un hotel
  const onHotelChange = async () => {
  if (!selectedHotel.value) return;

  loadingRooms.value = true;
  const allRooms = await getRoomsByHotelId(selectedHotel.value.id);
  rooms.value = allRooms; // Guardamos todas para filtrar luego
  loadingRooms.value = false;
  selectedRoom.value = null;
};

  // Seleccionar habitación (solo si está disponible)
  const onRoomSelected = (room) => {
  if (room.isAvailable) {
  selectedRoom.value = room;
}
};

  // Ir a pago
  const goToPayment = () => {
  localStorage.setItem('selectedHotel', JSON.stringify(selectedHotel.value));
  localStorage.setItem('selectedRoom', JSON.stringify(selectedRoom.value));
  localStorage.setItem('selectedRoom', JSON.stringify(selectedRoom.value));
  router.push({ name: 'SelectDatesPage' });

  };

  // Badge severity por estado
  const getBadgeSeverity = (status) => {
  switch (status) {
  case 'Available':
  return 'success';
  case 'Occupied':
  return 'danger';
  case 'Cleaning':
  return 'warning';
  case 'Maintenance':
  return 'info';
  default:
  return 'secondary';
}
};

  onMounted(() => {
  loadHotels();
});

  return {
  hotels,
  selectedHotel,
  rooms,
  availableRooms,
  selectedRoom,
  loadingRooms,
  onHotelChange,
  onRoomSelected,
  goToPayment,
  getBadgeSeverity
};
}
};
</script>

<style scoped>
.room-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.room-card:hover {
  transform: scale(1.02);
}
.room-card.selected {
  border: 2px solid #4caf50;
  background-color: #f0fff0;
}

h2,h3,h4,h5 {
  color: #333;
}
</style>