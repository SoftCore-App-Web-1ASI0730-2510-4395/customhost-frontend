<script setup>
defineProps({
  rooms: Array,
  getRoomRequests: Function,
  getStatusSeverity: Function
})

const selectedRoom = defineModel('selectedRoom')
</script>

<template>
  <pv-card class="h-full">
    <template #title>Rooms</template>
    <template #content>
      <pv-data-table
          :value="rooms"
          selectionMode="single"
          v-model:selection="selectedRoom"
          dataKey="id"
          class="p-datatable-sm"
      >
        <pv-column field="number" header="Número"></pv-column>
        <pv-column field="type" header="Tipo"></pv-column>
        <pv-column field="status" header="Estado">
          <template #body="{data}">
            <pv-tag :value="data.status" :severity="getStatusSeverity(data.status)" />
          </template>
        </pv-column>
        <pv-column header="Peticiones">
          <template #body="{data}">
            <pv-badge :value="getRoomRequests(data.id).length" severity="danger" />
          </template>
        </pv-column>
      </pv-data-table>
    </template>
  </pv-card>
</template>