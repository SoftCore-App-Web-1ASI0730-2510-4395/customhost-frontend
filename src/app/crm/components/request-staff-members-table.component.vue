<script setup>
import { computed } from 'vue'


const props = defineProps({
  staffMembers: {
    type: Array,
    required: true
  },
  activeRequests: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete-click'])


const getActiveRequestsCount = (staffId) => {
  return props.activeRequests.filter(req => req.assignedTo === staffId).length
}

const departments = computed(() => {
  return [...new Set(props.staffMembers.map(member => member.department))]
})
</script>

<template>
  <pv-card clas="staff-table-card">
    <template #title>
      <div class="flex align-items-center">
        <i class="pi pi-users mr-2"></i>
        <span>Personal del Hotel</span>
      </div>
    </template>
    <template #content>

      <pv-data-table
          :value="staffMembers"
          :paginator="true"
          :rows="5"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
      >
        <!-- Columna Nombre Completo -->
        <pv-column field="fullName" header="Name" sortable="true">
          <template #body="{data}">
            {{ data.firstName }} {{ data.lastName }}
          </template>
          <template #filter="{ filterModel }">
            <pv-input-text v-model="filterModel.value" placeholder="Buscar por nombre" />
          </template>
        </pv-column>

        <!-- Columna Departamento -->
        <pv-column field="department" header="Department" sortable="true">
          <template #filter="{ filterModel }">
            <pv-select
                v-model="filterModel.value"
                :options="departments"
                placeholder="Todos"
                showClear
            />
          </template>
        </pv-column>

        <pv-column field="phone" header="Phone number"></pv-column>

        <!-- Columna Estado -->
        <pv-column field="status" header="Status" sortable="true">
          <template #body="{data}">
            <pv-tag
                :value="data.status === 'Active' ? 'Active' : 'Inactive'"
                :severity="data.status === 'Active' ? 'success' : 'danger'"
            />
          </template>
        </pv-column>

        <!-- Columna Peticiones Activas -->
        <pv-column header="Active petitions" sortable="true">
          <template #body="{data}">
            <pv-badge
                :value="getActiveRequestsCount(data.id)"
                severity="danger"
                v-if="getActiveRequestsCount(data.id) >= 0"
            />
            <span v-else>0</span>
          </template>
        </pv-column>

        <!-- Columna Acciones -->
        <pv-column header="Actions">
          <template #body="{data}">
            <pv-button
                icon="pi pi-pencil"
                class="p-button-sm p-button-text mr-2"
                @click="emit('edit', data)"
            />
            <pv-button
                icon="pi pi-trash"
                class="p-button-sm p-button-text p-button-danger"
                @click="emit('delete-click', data)"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th),
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.5rem 1rem;
}


</style>