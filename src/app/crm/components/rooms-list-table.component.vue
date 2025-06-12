<template>
  <DataTable :value="rooms" class="p-datatable-sm" dataKey="id">
    <Column field="hotelId" :header="t('dashboard.rooms_management.hotelId')" />
    <Column field="number" :header="t('dashboard.rooms_management.room')" />
    <Column field="type" :header="t('dashboard.rooms_management.type')" />
    <Column field="status" :header="t('dashboard.rooms_management.status')" />
    <Column field="price" :header="t('dashboard.rooms_management.price')" />
    <Column field="floor" :header="t('dashboard.rooms_management.floor')" />
    <Column :header="t('dashboard.rooms_management.actions')">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" class="p-button-sm p-button-text" @click="$emit('edit', slotProps.data)" />
        <Button icon="pi pi-trash" class="p-button-sm p-button-text text-red-500" @click="$emit('delete', slotProps.data.id)" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const { t } = useI18n()
defineProps({
  rooms: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'delete'])
</script>