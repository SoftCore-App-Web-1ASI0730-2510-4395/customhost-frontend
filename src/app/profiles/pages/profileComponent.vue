<template>
  <div v-if="admin" class="p-4">
    <h2>Perfil del Administrador</h2>

    <!-- Información personal -->
    <Card class="mb-5">
      <template #title>Datos Personales</template>
      <template #content>
        <ul class="list-none p-0 m-0">
          <li class="flex align-items-center mb-3">
            <i class="pi pi-user text-xl mr-3 text-primary"></i>
            <span><strong>Nombre:</strong> {{ admin.fullName }}</span>
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

    <!-- Información del hotel -->
    <Card>
      <template #title>{{ admin.hotelName }}</template>
      <template #subtitle>{{ admin.hotelAddress }}</template>
      <template #content>
        <ul class="list-none p-0 m-0">
          <li class="flex align-items-center mb-3">
            <i class="pi pi-check-circle text-xl mr-3 text-success"></i>
            <span><strong>Estado:</strong> {{ admin.hotelStatus }}</span>
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
  </div>
  <div v-else class="p-4 text-center">
    <ProgressSpinner />
    <p>Cargando perfil...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'
import { getAdminProfile } from '../services/hotel-admin.service.js'

const admin = ref(null)

onMounted(async () => {
  const profile = await getAdminProfile(3) // Aquí puedes pasar ID dinámico desde auth
  admin.value = profile
})
</script>