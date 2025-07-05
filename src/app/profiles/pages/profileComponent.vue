<template>
  <div class="p-4">
    <!-- ADMIN -->
    <template v-if="userRole === 'ADMIN'">
      <div class="hotel-title text-xl font-bold mb-4">
        {{ admin.hotelName }} - Perfil del Administrador
      </div>
      <Card class="mb-5">
        <template #title>Datos Personales</template>
        <template #content>
          <ul class="list-none p-0 m-0">
            <li class="flex align-items-center mb-3">
              <i class="pi pi-user text-xl mr-3 text-primary"></i>
              <span><strong>Nombre:</strong> {{ fullName }}</span>
            </li>
            <li class="flex align-items-center mb-3">
              <i class="pi pi-envelope text-xl mr-3 text-primary"></i>
              <span><strong>Email:</strong> {{ admin.email }}</span>
            </li>
            <li class="flex align-items-center mb-3">
              <i class="pi pi-phone text-xl mr-3 text-primary"></i>
              <span><strong>Teléfono:</strong> {{ admin.phone }}</span>
            </li>
            <li class="flex align-items-center">
              <i class="pi pi-briefcase text-xl mr-3 text-primary"></i>
              <span><strong>Departamento:</strong> {{ admin.department }}</span>
            </li>
          </ul>
        </template>
      </Card>
      <Card>
        <template #title>{{ admin.hotelName }}</template>
        <template #subtitle>{{ admin.hotelAddress }}</template>
        <template #content>
          <ul class="list-none p-0 m-0">
            <li class="flex align-items-center mb-3">
              <i :class="getHotelStatusIcon(admin.hotelStatus)" class="text-xl mr-3" :style="{ color: getHotelStatusColor(admin.hotelStatus) }"></i>
              <span><strong>Estado del hotel:</strong> {{ formatHotelStatus(admin.hotelStatus) }}</span>
            </li>
            <li class="flex align-items-center mb-3">
              <i class="pi pi-home text-xl mr-3 text-info"></i>
              <span><strong>Habitaciones totales:</strong> {{ admin.totalRooms }}</span>
            </li>
            <li class="flex align-items-center mb-3">
              <i class="pi pi-lock-open text-xl mr-3 text-danger"></i>
              <span><strong>Ocupadas:</strong> {{ admin.occupiedRooms }}</span>
            </li>
            <li class="flex align-items-center mb-3">
              <i class="pi pi-refresh text-xl mr-3 text-warning"></i>
              <span><strong>En limpieza:</strong> {{ admin.cleaningRooms }}</span>
            </li>
            <li class="flex align-items-center">
              <i class="pi pi-wrench text-xl mr-3 text-secondary"></i>
              <span><strong>Mantenimiento:</strong> {{ admin.maintenanceRooms }}</span>
            </li>
          </ul>
        </template>
      </Card>
    </template>

    <!-- STAFF o GUEST -->
    <template v-else-if="userRole === 'STAFF' || userRole === 'GUEST'">
      <div class="hotel-title text-xl font-bold mb-4">
        Perfil de {{ userRole === 'STAFF' ? 'Staff' : 'Huésped' }}
      </div>
      <Card class="mb-5">
        <template #title>Datos Personales</template>
        <template #content>
          <ul class="list-none p-0 m-0">
            <li class="flex align-items-center mb-3">
              <i class="pi pi-user text-xl mr-3 text-primary"></i>
              <span><strong>Nombre:</strong> {{ user?.username || 'Usuario' }}</span>
            </li>
            <li class="flex align-items-center mb-3">
              <i class="pi pi-envelope text-xl mr-3 text-primary"></i>
              <span><strong>Email:</strong> {{ user?.email || 'Sin email' }}</span>
            </li>
          </ul>
        </template>
      </Card>
      <Card>
        <template #title>Hoteles Asociados</template>
        <template #content>
          <ul class="list-none p-0 m-0">
            <li v-for="hotel in associatedHotels" :key="hotel.id" class="mb-4">
              <div class="font-bold">{{ hotel.name }}</div>
              <div><i class="pi pi-map-marker mr-2"></i>{{ hotel.address }}</div>
              <div><i class="pi pi-envelope mr-2"></i>{{ hotel.email }}</div>
              <div><i class="pi pi-phone mr-2"></i>{{ hotel.phone }}</div>
              <div><i :class="getHotelStatusIcon(hotel.status)" class="mr-2" :style="{ color: getHotelStatusColor(hotel.status) }"></i>{{ formatHotelStatus(hotel.status) }}</div>
            </li>
            <li v-if="associatedHotels.length === 0">No tienes hoteles asociados.</li>
          </ul>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../shared/composables/useAuth.js'
import Card from 'primevue/card'
import { getHotels } from '../../crm/services/hotels.service.js'

const { user } = useAuth()
const userRole = computed(() => user.value?.role)

const admin = ref({
  id: 3,
  firstName: user.value?.username || 'Usuario',
  lastName: 'Perez',
  email: user.value?.email || 'usuario@hotel.com',
  phone: '+34600111222',
  department: 'Management',
  hotelName: 'Hotel Cheraton Center',
  hotelAddress: 'Calle Gran Vía 123, Lima',
  hotelStatus: 'active',
  totalRooms: 6,
  occupiedRooms: 2,
  availableRooms: 3,
  cleaningRooms: 1,
  maintenanceRooms: 1
})

const fullName = computed(() => `${admin.value.firstName} ${admin.value.lastName}`)

const associatedHotels = ref([])

onMounted(async () => {
  if (userRole.value === 'STAFF' || userRole.value === 'GUEST') {
    // Aquí deberías reemplazar por la lógica real para obtener los hoteles asociados al usuario
    // Por ahora, se filtran todos los hoteles donde el usuario es staff o guest (simulado)
    const allHotels = await getHotels()
    // Simulación: asocia todos los hoteles al usuario
    associatedHotels.value = allHotels
    // Si tienes una relación real, filtra aquí por userId
  }
})

// Métodos auxiliares
const formatHotelStatus = (status) => {
  const statuses = {
    active: 'Activo',
    inactive: 'Inactivo',
    maintenance: 'Mantenimiento',
    pending: 'Pendiente'
  }
  return statuses[status] || status
}

const getHotelStatusIcon = (status) => {
  const icons = {
    active: 'pi-check-circle',
    inactive: 'pi-times-circle',
    maintenance: 'pi-exclamation-triangle',
    pending: 'pi-clock'
  }
  return icons[status] || 'pi-question'
}

const getHotelStatusColor = (status) => {
  const colors = {
    active: '#4caf50',
    inactive: '#f44336',
    maintenance: '#ff9800',
    pending: '#2196f3'
  }
  return colors[status] || '#9e9e9e'
}
</script>

<style scoped>
.hotel-title {
  color: #1a237e;
  letter-spacing: 1px;
}
.text-primary {
  color: #2196f3;
}
.text-success {
  color: #4caf50;
}
.text-info {
  color: #2196f3;
}
.text-danger {
  color: #f44336;
}
.text-warning {
  color: #ff9800;
}
.text-secondary {
  color: #9e9e9e;
}
</style>