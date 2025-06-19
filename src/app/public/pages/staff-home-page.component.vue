<template>
  <div class="mb-30px"></div>
  <!-- Saludo elegante -->
  <div class="text-4xl font-extrabold text-center mb-8 text-gray-800">
    ¡Bienvenido, {{ usuarioNombre }}!
  </div>
  <div style="max-width: 500px; margin: 0 auto;">
    <h3 class="text-center mb-2" style="font-weight:600;">Gráfico de pagos 2025</h3>
    <canvas id="paymentsBarChart" height="400"></canvas>
  </div>
  <div style="max-width: 900px; margin: 32px auto 0 auto;">
    <h3 class="text-center mb-2" style="font-weight:600;">Habitaciones disponibles</h3>
    <div v-if="availableRooms.length > 0" class="rooms-grid">
      <div
        v-for="room in availableRooms"
        :key="room.id"
        class="room-card"
      >
        <div class="room-card-header">
          <span class="room-number">Habitación {{ room.number }}</span>
        </div>
        <div class="room-card-body">
          <div class="room-type">{{ room.type }}</div>
          <div class="room-floor">Piso {{ room.floor }}</div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">No hay habitaciones disponibles.</div>
  </div>

  <!-- NUEVA SECCIÓN: Dispositivos IoT en mantenimiento o inactivos -->
  <div style="max-width: 900px; margin: 40px auto 0 auto;">
    <h3 class="text-center mb-2" style="font-weight:600;">Dispositivos IoT en mantenimiento o inactivos</h3>
    <div v-if="iotDevicesWithIssues.length > 0" class="iot-issues-list">
      <div
        v-for="item in iotDevicesWithIssues"
        :key="item.roomDeviceId"
        class="iot-issue-card"
      >
        <div class="iot-issue-header">
          <span class="iot-device-name">{{ item.deviceName }}</span>
        </div>
        <div class="iot-issue-body">
          <span class="iot-device-status" :class="item.status">{{ item.status }}</span>
          <span class="iot-device-room">Habitación {{ item.roomNumber }}</span>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">No hay dispositivos IoT en mantenimiento o inactivos.</div>
    <div class="mb-30px"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { homeFacade } from '../services/home.facade.js';
import Chart from 'chart.js/auto';

const availableRooms = ref([]);
const iotDevicesWithIssues = ref([]);
const usuarioNombre      = ref('Juan Pérez'); // TODO: desde sesión
// 1) Gráfico de pagos
function groupPaymentsByMonth(payments) {
  const months = {};
  payments.forEach(payment => {
    const date = new Date(payment.paymentDate || payment.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] || 0) + payment.amount;
  });
  return months;
}

async function fetchAvailableRooms() {
  const rooms = await homeFacade.getAvailableRooms();
  console.log('🎉 Rooms raw data:', rooms);
  rooms.forEach((room, i) => {
    console.log(`Room ${i}:`, room);
    console.log('Attributes:', Object.keys(room).join(', '));
  });
  availableRooms.value = rooms;
}

async function fetchIotDevicesWithIssues() {
  // Obtenemos todas las habitaciones con sus dispositivos
  const roomsWithDevices = await homeFacade.getRoomsWithIotDevices();
  console.log('📦 roomsWithDevices:', roomsWithDevices);

  // Aplanamos todos los dispositivos asignados
  const allRoomDevices = [];
  roomsWithDevices.forEach(room => {
    room.devices.forEach(dev => {
      allRoomDevices.push({
        roomDeviceId: dev.roomDeviceId,
        status: dev.status,
        roomId: room.id,
        roomNumber: room.number,
        deviceName: dev.name,
        type: dev.type
      });
    });
  });
  console.log('🧩 All roomDevices flattened:', allRoomDevices);

  // Filtramos los que NO estén en "Working"
  const filtered = allRoomDevices.filter(device => device.status !== 'working');
  console.log('🔧 Devices with issues (status ≠ "Working"):', filtered);

  iotDevicesWithIssues.value = filtered;
}

onMounted(async () => {
  // a) Inicializar gráfico de pagos
  const payments = await homeFacade.getAllPayments();
  const grouped = groupPaymentsByMonth(payments);
  const labels = Object.keys(grouped).sort();
  const data = labels.map(label => grouped[label]);

  new Chart(document.getElementById('paymentsBarChart'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Total Pagos (USD)', data, backgroundColor: '#10b981' }] },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, title: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Mes' } },
        y: { title: { display: true, text: 'Monto (USD)' } }
      }
    }
  });

  // b) Cargar y loggear habitaciones disponibles
  await fetchAvailableRooms();

  // c) Cargar y loggear dispositivos IoT cuyo status ≠ "Working"
  await fetchIotDevicesWithIssues();
});
</script>




<style>
h3{
  color:black;
}
.text-gray-800 { color: #1f2937; }
.text-gray-700 { color: #374151; }
/* Grid para las cards, máximo 3 por fila */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 24px;
}

/* Card moderna para cada habitación */
.room-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.10);
  padding: 20px 18px 16px 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s, transform 0.2s;
  color: #111;
  border: 1px solid #e5e7eb;
}
.room-card:hover {
  box-shadow: 0 6px 24px rgba(16, 185, 129, 0.18);
  transform: translateY(-2px) scale(1.03);
}
.room-card-header {
  width: 100%;
  font-weight: 700;
  font-size: 1.2rem;
  color: #059669;
  margin-bottom: 8px;
}
.room-number {
  letter-spacing: 0.5px;
}
.room-card-body {
  width: 100%;
}
.room-type {
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 4px;
}
.room-floor {
  font-size: 0.95rem;
  color: #666;
}

/* Elimina estilos antiguos de la lista */
.room-available-item {
  /* Eliminado: color: #000 !important; */
  display: none;
}

/* NUEVOS ESTILOS PARA LA LISTA DE DISPOSITIVOS IOT CON PROBLEMAS */
.iot-issues-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 24px;
}
.iot-issue-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(234, 179, 8, 0.10);
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #facc15;
  color: #111;
  transition: box-shadow 0.2s, transform 0.2s;
}
.iot-issue-card:hover {
  box-shadow: 0 6px 18px rgba(234, 179, 8, 0.18);
  transform: translateY(-2px) scale(1.03);
}
.iot-issue-header {
  width: 100%;
  font-weight: 700;
  font-size: 1.1rem;
  color: #eab308;
  margin-bottom: 6px;
}
.iot-device-name {
  letter-spacing: 0.5px;
}
.iot-issue-body {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.98rem;
}
.iot-device-status {
  font-weight: 600;
  text-transform: capitalize;
}
.iot-device-status.maintenance {
  color: #f59e42;
}
.iot-device-status.inactive {
  color: #ef4444;
}
.iot-device-room {
  color: #666;
}

.mb-30px {
  margin-bottom: 30px;
}
</style>