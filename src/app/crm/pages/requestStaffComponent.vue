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

const departments = ref([
  { label: 'Housekeeping', value: 'Housekeeping' },
  { label: 'Technical Support', value: 'Technical Support' },
  { label: 'Reception', value: 'Reception' },
  { label: 'Management', value: 'Management' },
  { label: 'Room Service', value: 'Room Service' }
]);

const fetchData = async () => {
  try {
    const [staffRes, requestsRes] = await Promise.all([
      axios.get(`${API_URL}/api/v1/staff-members`),
      axios.get(`${API_URL}/api/v1/crm/service-request?status_ne=Completed`)
    ])
    staffMembers.value = staffRes.data
    activeRequests.value = requestsRes.data
  } catch (error) {
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