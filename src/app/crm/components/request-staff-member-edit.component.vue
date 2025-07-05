<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  staffMember: Object,
  departments: Array
});

const emit = defineEmits(['update:visible', 'save']);

const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  department: '',
  status: 'Active'
});

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
];

watch(() => props.staffMember, (newVal) => {
  if (newVal) {
    formData.value = {
      firstName: newVal.firstName,
      lastName: newVal.lastName,
      phone: newVal.phone,
      email: newVal.email,
      department: newVal.department,
      status: newVal.status || 'Active'
    };
  }
}, { immediate: true });

const save = () => {
  emit('save', formData.value);
  emit('update:visible', false);
};
</script>

<template>
  <pv-dialog
      :visible="visible"
      modal
      header="Editar Miembro del Personal"
      :style="{ width: '600px' }"
      @update:visible="(val) => $emit('update:visible', val)"
  >

    <div class="form-grid">
      <!-- Fila 1: Nombre y Apellido -->
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">Name</label>
          <pv-input-text id="firstName" v-model="formData.firstName" class="w-full" />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <pv-input-text id="lastName" v-model="formData.lastName" class="w-full" />
        </div>
      </div>

      <!-- Fila 2: Teléfono y Email -->
      <div class="form-row">
        <div class="form-group">
          <label for="phone">Phone number</label>
          <pv-input-text id="phone" v-model="formData.phone" class="w-full" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <pv-input-text id="email" v-model="formData.email" class="w-full" />
        </div>
      </div>

      <!-- Fila 3: Departamento y Estado -->
      <div class="form-row">
        <div class="form-group">
          <label for="department">Department</label>
          <pv-select
              id="department"
              v-model="formData.department"
              :options="departments"
              optionLabel="label"
              optionValue="value"
              class="w-full"
          />
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <pv-select
              id="status"
              v-model="formData.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <pv-button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-text"
            @click="$emit('update:visible', false)"
        />
        <pv-button
            label="Guardar"
            icon="pi pi-check"
            @click="save"
            autofocus
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}



@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
}

</style>