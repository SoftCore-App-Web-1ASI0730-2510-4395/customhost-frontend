<script setup>
defineProps({
  requests: Array,
  staffMembers: Array,
  formatDate: Function,
  getRequestSeverity: Function
})

const emit = defineEmits(['assignStaff', 'resolveRequest', 'deleteRequest'])

const handleAssignStaff = (requestId, staffId) => {
  emit('assignStaff', requestId, staffId)
}

const handleResolveRequest = (id) => {
  emit('resolveRequest', id)
}

const handleDeleteRequest = (id) => {
  emit('deleteRequest', id)
}
</script>

<template>
  <pv-card>
    <template #title>Peticiones Pendientes</template>
    <template #subtitle>
      <slot name="subtitle"></slot>
    </template>
    <template #content>
      <pv-data-table
          :value="requests"
          class="p-datatable-sm"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
      >
        <pv-column field="createdAt" header="Fecha">
          <template #body="{data}">
            {{ formatDate(data.createdAt) }}
          </template>
        </pv-column>
        <pv-column field="type" header="Tipo"></pv-column>
        <pv-column field="description" header="Descripción"></pv-column>
        <pv-column field="status" header="Estado">
          <template #body="{data}">
            <pv-tag :value="data.status" :severity="getRequestSeverity(data.status)" />
          </template>
        </pv-column>
        <pv-column field="assignedTo" header="Asignado a">
          <template #body="{data}">
            <pv-select
                v-model="data.assignedTo"
                :options="staffMembers"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccionar personal"
                @update:modelValue="handleAssignStaff(data.id, data.assignedTo)"
                class="w-full"
                :clearable="true"
            >
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <span>{{ slotProps.option.name }}</span>
                  <span class="ml-2 text-sm text-color-secondary">({{ slotProps.option.role }})</span>
                </div>
              </template>
            </pv-select>
          </template>
        </pv-column>
        <pv-column header="Acciones">
          <template #body="{data}">
            <pv-button
                icon="pi pi-check"
                class="p-button-sm p-button-text mr-2"
                @click="handleResolveRequest(data.id)"
                v-if="data.status !== 'Resuelto'"
            />
            <pv-button
                icon="pi pi-trash"
                class="p-button-sm p-button-text text-red-500"
                @click="handleDeleteRequest(data.id)"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </template>
  </pv-card>
</template>