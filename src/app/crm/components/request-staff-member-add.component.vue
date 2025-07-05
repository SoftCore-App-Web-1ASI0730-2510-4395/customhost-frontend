<script setup>
import { ref } from 'vue';

const props = defineProps({
  visible: Boolean,
  departments: Array
});

const emit = defineEmits(['update:visible', 'save']);

const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  department: '',
  hotelId: '' // Nuevo campo para hotelId
});

const save = () => {
  if (!formData.value.firstName || !formData.value.lastName) {
    alert('Nombre y apellido son requeridos');
    return;
  }
  if (!formData.value.hotelId || isNaN(formData.value.hotelId) || Number(formData.value.hotelId) <= 0) {
    alert('hotelId es requerido y debe ser un número positivo');
    return;
  }
  emit('save', { ...formData.value, hotelId: Number(formData.value.hotelId) });
  emit('update:visible', false);
};
</script>

<template>
  <pv-dialog
      :visible="visible"
      modal
      header="Agregar Nuevo Personal"
      :style="{ width: '650px' }"
      @update:visible="(val) => $emit('update:visible', val)"
  >
    <div class="form-grid">
      <!-- Fila 1: Nombre y Apellido -->
      <div class="form-row">
        <div class="form-group">
          <label>Nombre*</label>
          <pv-input-text v-model="formData.firstName" class="w-full" />
        </div>
        <div class="form-group">
          <label>Apellido*</label>
          <pv-input-text v-model="formData.lastName" class="w-full" />
        </div>
      </div>

      <!-- Fila 2: Teléfono y Email -->
      <div class="form-row">
        <div class="form-group">
          <label>Teléfono</label>
          <pv-input-text v-model="formData.phone" class="w-full" />
        </div>
        <div class="form-group">
          <label>Email*</label>
          <pv-input-text v-model="formData.email" class="w-full" />
        </div>
      </div>

      <!-- Fila 2.5: hotelId -->
      <div class="form-row">
        <div class="form-group">
          <label>ID del Hotel*</label>
          <pv-input-text v-model="formData.hotelId" class="w-full" type="number" min="1" />
        </div>
      </div>

      <!-- Fila 3: Departamento y Contraseña -->
      <div class="form-row">
        <div class="form-group">
          <label>Departamento*</label>
          <pv-select
              v-model="formData.department"
              :options="departments"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="Seleccionar"
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
</style>