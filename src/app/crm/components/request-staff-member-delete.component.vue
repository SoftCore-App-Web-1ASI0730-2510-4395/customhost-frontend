<script setup>
defineProps({
  visible: Boolean,
  staffName: String
});

const emit = defineEmits(['update:visible', 'confirm']);

const cancel = () => {
  emit('update:visible', false); // Esto debería cerrar el diálogo
};

</script>


<template>
  <pv-dialog
      :visible="visible"
      modal
      header="Confirmar Eliminación"
      :style="{ width: '450px' }"
      @update:visible="(val) => emit('update:visible', val)"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-2" style="color: #e74c3c;"></i>
      <span>¿Estás seguro de eliminar a <strong>{{ staffName }}</strong>? Esta acción no se puede deshacer.</span>
    </div>

    <template #footer>
      <pv-button
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text"
          @click=cancel
      />
      <pv-button
          label="Eliminar"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="$emit('confirm')"
      />
    </template>
  </pv-dialog>
</template>

<style scoped>
.confirmation-content {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.p-button-danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

.p-button-danger:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}
</style>