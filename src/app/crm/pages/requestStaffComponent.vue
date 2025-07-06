<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import StaffMembersTable from '../components/request-staff-members-table.component.vue'
import StaffMemberDialog from '../components/request-staff-member-edit.component.vue';
import AddStaffMemberDialog from '../components/request-staff-member-add.component.vue';
import DeleteConfirmDialog from '../components/request-staff-member-delete.component.vue';
import {staffService} from "../services/request-staff.service.js";

const API_URL = import.meta.env.VITE_API_BASE_URL
const staffMembers = ref([])
const activeRequests = ref([])
const loading = ref(true)
const editDialogVisible = ref(false);
const currentStaffMember = ref(null);
const deleteDialogVisible = ref(false);
const staffToDelete = ref(null);
const errorMessage = ref('');

const departments = ref([
  { label: 'Housekeeping', value: 'Housekeeping' },
  { label: 'Technical Support', value: 'Technical Support' },
  { label: 'Reception', value: 'Reception' },
  { label: 'Management', value: 'Management' },
  { label: 'Room Service', value: 'Room Service' }
]);

const fetchData = async () => {
  try {
    staffMembers.value = await staffService.getAllStaffMembers();
    // Intentar obtener peticiones activas del backend
    let requestsRes;
    try {
      requestsRes = await axios.get(`${API_URL}/api/v1/crm/service-request`);
      // Filtrar en frontend las peticiones activas
      activeRequests.value = Array.isArray(requestsRes.data)
        ? requestsRes.data.filter(req => req.status === 'Open' || req.status === 'InProgress')
        : [];
      errorMessage.value = '';
    } catch (err) {
      // Si falla, usar datos mock para desarrollo
      errorMessage.value = 'No se pudieron cargar las peticiones activas. Mostrando datos de ejemplo.';
      activeRequests.value = [
        { id: 1, assignedTo: staffMembers.value[0]?.id, status: 'Open', description: 'Mock request 1' },
        { id: 2, assignedTo: staffMembers.value[1]?.id, status: 'InProgress', description: 'Mock request 2' }
      ];
    }
    // Logs de depuración para verificar estructura y relación
    console.log('Staff members cargados:', staffMembers.value);
    console.log('Active requests cargadas:', activeRequests.value);
    if (activeRequests.value.length > 0) {
      console.log('Ejemplo de petición activa:', activeRequests.value[0]);
    }
    // Verificar relación assignedTo
    staffMembers.value.forEach(staff => {
      const count = activeRequests.value.filter(req => req.assignedTo === staff.id).length;
      console.log(`Staff ${staff.firstName} ${staff.lastName} (ID: ${staff.id}) tiene ${count} peticiones activas.`);
    });
  } catch (error) {
    errorMessage.value = 'Error cargando datos de personal.';
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const addDialogVisible = ref(false);

const handleAdd = () => {
  addDialogVisible.value = true;
};

const handleDeleteClick = (staff) => {
  staffToDelete.value = staff;
  deleteDialogVisible.value = true;
};

const confirmDelete = async () => {
  try {
    await staffService.deleteStaffMember(staffToDelete.value.id);
    staffMembers.value = staffMembers.value.filter(
        m => m.id !== staffToDelete.value.id
    );
    console.log(`${staffToDelete.value.firstName} eliminado correctamente`);
  } catch (error) {
    console.error(error);
  } finally {
    deleteDialogVisible.value = false;
  }
};

const handleSaveNewStaff = async (newStaffData) => {
  console.log('Datos recibidos en handleSaveNewStaff:', newStaffData);
  try {
    const createdStaff = await staffService.createStaffMember(newStaffData);
    console.log('Respuesta del backend al crear personal:', createdStaff);
    staffMembers.value.push(createdStaff);
    addDialogVisible.value = false;
    console.log('Personal agregado exitosamente');
  } catch (error) {
    console.error('Error al agregar personal');
    console.error(error);
  }
};

const handleEdit = (staffMember) => {
  currentStaffMember.value = staffMember;
  editDialogVisible.value = true;
};

const handleCancelDelete = () => {
  deleteDialogVisible.value = false;
};

const handleSave = async (updatedData) => {
  try {
    // Actualiza la lista local sin necesidad de recargar
    const index = staffMembers.value.findIndex(m => m.id === currentStaffMember.value.id);
    if (index !== -1) {
      // Mantenemos todas las propiedades existentes y solo actualizamos las modificadas
      staffMembers.value[index] = {
        ...staffMembers.value[index],
        ...updatedData,
        status: updatedData.status || staffMembers.value[index].status
      };
    }

    editDialogVisible.value = false;
    console.log('Estado actualizado correctamente');
  } catch (error) {
    console.error('Error updating staff member:', error);
    console.error('Error al actualizar el estado');
  }
};

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="staff-members-view">
    <div v-if="errorMessage" class="p-error mb-3">{{ errorMessage }}</div>
    <div class="flex justify-content-between align-items-center mb-3">
      <h1>Hotel Cheraton - Staff Member</h1>
      <pv-button label="Agregar Personal"
                 icon="pi pi-plus"
                 @click="handleAdd"
                 class="add-button"
      />

      <AddStaffMemberDialog
          v-model:visible="addDialogVisible"
          :departments="departments"
          @save="handleSaveNewStaff"
      />
    </div>

    <StaffMembersTable
        :staff-members="staffMembers"
        :active-requests="activeRequests"
        @edit="handleEdit"
        @delete-click="handleDeleteClick"
    />

    <DeleteConfirmDialog
        :visible="deleteDialogVisible"
        @update:visible="handleCancelDelete"
        :staff-name="staffToDelete ? `${staffToDelete.firstName} ${staffToDelete.lastName}` : ''"
        @confirm="confirmDelete"
    />


    <StaffMemberDialog
        :visible="editDialogVisible"
        :staff-member="currentStaffMember"
        :departments="departments"
        @update:visible="editDialogVisible = $event"
        @save="handleSave"
    />

  </div>
</template>

<style scoped>
.staff-members-view {
  padding: 1.2rem;
}


</style>