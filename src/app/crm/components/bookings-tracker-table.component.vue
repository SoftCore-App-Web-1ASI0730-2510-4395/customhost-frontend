<template>
  <DataTable :value="bookings" :size="'large'" paginator :rows="10" class="p-datatable-sm">
    <Column field="fullName" :header="t('dashboard.bookings_tracker.guest')">
      <template #body="{ data }">
        <i class="pi pi-user text-blue-500 mr-2"></i>
        {{ data.fullName }}
      </template>
    </Column>
    <Column field="roomNumber" :header="t('dashboard.bookings_tracker.hotelId')">
      <template #body="{ data }">
        <i class="pi pi-building text-orange-500 mr-2"></i>
        {{ data.hotelId }}
      </template>
    </Column>
    <Column field="roomNumber" :header="t('dashboard.bookings_tracker.room')">
      <template #body="{ data }">
        <i class="pi pi-building text-purple-500 mr-2"></i>
        {{ data.roomNumber }}
      </template>
    </Column>
    <Column field="checkInDate" :header="t('dashboard.bookings_tracker.checkIn')">
      <template #body="{ data }">
        <i class="pi pi-calendar-plus text-green-500 mr-2"></i>
        {{ formatDate(data.checkInDate) }}
      </template>
    </Column>
    <Column field="checkOutDate" :header="t('dashboard.bookings_tracker.checkOut')">
      <template #body="{ data }">
        <i class="pi pi-calendar-minus text-red-500 mr-2"></i>
        {{ formatDate(data.checkOutDate) }}
      </template>
    </Column>
    <Column field="totalPrice" :header="t('dashboard.bookings_tracker.totalPrice')">
      <template #body="{ data }">
        <i class="pi pi-money-bill text-green-500 mr-2"></i>
        {{ data.totalPrice }}
      </template>
    </Column>
    <Column field="status" :header="t('dashboard.bookings_tracker.status')">
      <template #body="{ data }">
        {{ data.status }}
      </template>
    </Column>
    <Column field="paymentStatus" :header="t('dashboard.bookings_tracker.paymentStatus')">
      <template #body="{ data }">
        {{ data.paymentStatus }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const { t } = useI18n()

defineProps({
  bookings: {
    type: Array,
    required: true
  }
})

const formatDate = (date) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>