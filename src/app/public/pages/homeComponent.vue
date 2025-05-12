<template>
  <div class="p-4">
    <h2 class="mb-4">Panel de Administración Hotelera</h2>

    <!-- Tarjetas resumen -->
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

    <!-- Tarjeta: Dispositivos IoT Inactivos -->
    <div class="grid justify-content-center">
      <div class="col-12 sm:col-6 lg:col-4 xl:col-3 mb-4">
        <div class="card-container inactive-device shadow-2 border-round-xl p-4 bg-white h-full">
          <div class="flex flex-column align-items-center gap-2 text-center">
            <i class="pi pi-wifi text-4xl text-inactive"></i>
            <div class="text-2xl font-bold text-black">{{ inactiveIotCount }}</div>
            <div class="text-md text-color-secondary">Dispositivos IoT Inactivos</div>
            <Button v-if="inactiveIotCount > 0" label="Ver detalles" icon="pi pi-search" class="p-button-text p-button-sm mt-2" @click="showInactiveDevices = !showInactiveDevices" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lista opcional de dispositivos inactivos -->
    <div v-if="showInactiveDevices && inactiveIotList.length > 0" class="card p-4 surface-card mt-4">
      <h4>Lista de Dispositivos Inactivos</h4>
      <ul class="list-none pl-0">
        <li v-for="device in inactiveIotList" :key="device.id" class="py-2 border-bottom-1 border-gray-300 text-black">
          {{ device.name }} - {{ device.type }}
        </li>
      </ul>
    </div>

    <!-- Gráfico: Reservas en los últimos 30 días -->
    <h3 class="mt-5 mb-3">Reservas en los últimos 30 días</h3>
    <div class="card p-4 surface-card" style="min-height: 400px; width: 100%">
      <Chart type="line" :data="bookingsChartData" :options="chartOptions" />
    </div>

    <!-- Tabla de huéspedes -->
    <h3 class="mt-5 mb-3">Huéspedes actuales</h3>
    <DataTable :value="guests" class="p-datatable-sm">
      <Column field="roomNumber" header="Habitación" />
      <Column field="name" header="Nombre" />
      <Column field="checkIn" header="Check-in" />
      <Column field="checkOut" header="Check-out" />
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Chart from 'primevue/chart'
import { getHotelDashboardStats } from '../services/home.service.js'

// Datos reactivos
const summaryCards = ref([])
const guests = ref([])
const inactiveIotCount = ref(0)
const inactiveIotList = ref([])
const showInactiveDevices = ref(false)
const bookingsChartData = ref({})
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#495057'
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#495057'
      },
      grid: {
        color: '#ebedef'
      }
    },
    x: {
      ticks: {
        color: '#495057'
      },
      grid: {
        color: '#ebedef'
      }
    }
  }
})

onMounted(async () => {
  try {
    const stats = await getHotelDashboardStats()
    summaryCards.value = stats.summaryCards
    guests.value = stats.guests
    inactiveIotCount.value = stats.inactiveIot
    inactiveIotList.value = stats.inactiveIotList || []

    // Datos para gráfico
    bookingsChartData.value = {
      labels: stats.bookingsHistory.labels,
      datasets: [{
        label: 'Reservas por día',
        backgroundColor: '#2196f3',
        borderColor: '#1976d2',
        data: stats.bookingsHistory.data,
        tension: 0.4,
        fill: true
      }]
    }

  } catch (error) {
    console.error('No se pudieron cargar los datos del dashboard:', error)
  }
})
</script>

<style scoped>
.p-4 {
  background-color: #f8f9fa;
}

.card-container {
  border-left: 5px solid #2196f3;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
  min-height: 180px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.card-container:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.text-primary {
  color: #2196f3;
}

.text-inactive {
  color: #ef5350;
}

.text-black {
  color: #000000;
}

.text-color-secondary {
  color: #6c757d;
}

.card-container.inactive-device {
  border-left-color: #ef5350;
}

.card-container.inactive-device .text-primary {
  color: #ef5350;
}

.surface-card {
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.p-button-text {
  color: #2196f3;
  font-size: 0.8rem;
}

.p-button-text:hover {
  background-color: #e3f2fd;
}
</style>