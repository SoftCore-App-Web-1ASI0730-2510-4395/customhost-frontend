<template>
  <div class="p-4">
    <h2 class="mb-4">Panel de Administración Hotelera</h2>

    <!-- Cards centradas estilo dashboard -->
    <div class="grid justify-content-center">
      <div
          class="col-12 sm:col-6 lg:col-4 xl:col-3 mb-4"
          v-for="card in summaryCards"
          :key="card.title"
      >
        <div class="card-container shadow-2 border-round-xl p-4 bg-white h-full">
          <div class="flex flex-column align-items-center gap-2 text-center">
            <i :class="card.icon" class="text-4xl text-primary"></i>
            <div class="text-2xl font-bold text-black">{{ card.value }}</div>
            <div class="text-md text-color-secondary">{{ card.title }}</div>
            <Badge
                v-if="card.badge"
                :value="card.badge"
                severity="warning"
                class="mt-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de huéspedes -->
    <h3 class="mt-5 mb-3">Huéspedes actuales</h3>
    <DataTable :value="guests" class="p-datatable-sm">
      <Column field="room" header="Habitación" />
      <Column field="name" header="Nombre" />
      <Column field="checkIn" header="Check-in" />
      <Column field="checkOut" header="Check-out" />
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Badge from 'primevue/badge'

const summaryCards = [
  { title: 'Habitaciones ocupadas', value: '36 / 50', icon: 'pi pi-home' },
  { title: 'Reservas de hoy', value: '12', icon: 'pi pi-calendar-plus' },
  { title: 'Solicitudes de mantenimiento', value: '3', icon: 'pi pi-wrench', badge: 'Urgente' },
  { title: 'Check-outs pendientes', value: '5', icon: 'pi pi-sign-out' },
]

const guests = [
  { room: '101', name: 'Ana López', checkIn: '2025-05-08', checkOut: '2025-05-11' },
  { room: '202', name: 'Mario Ruiz', checkIn: '2025-05-09', checkOut: '2025-05-13' },
  { room: '303', name: 'Jorge Quispe', checkIn: '2025-05-07', checkOut: '2025-05-10' },
]
</script>

<style scoped>
.card-container {
  border-left: 5px solid #2196f3;
  transition: box-shadow 0.2s ease;
  min-height: 180px;
}
.card-container:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.text-black {
  color: #000;
}
</style>