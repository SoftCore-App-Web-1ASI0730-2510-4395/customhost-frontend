<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  modelValue: Boolean,
  rooms: Array,
  requestTypes: Array,
  priorityOptions: Array,
  form: Object
})

const emit = defineEmits([
  'update:modelValue',
  'update:form',
  'submit'
])

const requestForm = ref({
  roomId: null,
  type: null,
  description: '',
  priority: 'Media'
})

watch(() => props.form, (newVal) => {
  requestForm.value = { ...newVal }
}, { immediate: true })

const handleFormUpdate = () => {
  emit('update:form', requestForm.value)
}

const handleRoomSelect = (roomId) => {
  const selectedRoom = props.rooms.find(r => r.id === roomId)
  if (selectedRoom) {
    requestForm.value.roomId = selectedRoom.id
    requestForm.value.hotelId = selectedRoom.hotelId || 1 // Asume hotelId=1 si no existe en el objeto room
    requestForm.value.userId = 1 // Asigna un userId fijo, cámbialo si es necesario
    handleFormUpdate()
  }
}
</script>

<template>
  <pv-dialog
      :visible="props.modelValue"
      @update:visible="(value) => emit('update:modelValue', value)"
      modal
      header="Nueva Petición"
      :style="{width: '500px'}"
  >
    <form @submit.prevent="$emit('submit', requestForm)">
      <div class="p-fluid">
        <div class="field mb-3">
          <label>Título</label>
          <pv-input-text
            v-model="requestForm.title"
            placeholder="Título de la petición"
            class="w-full"
            @update:modelValue="handleFormUpdate"
          />
        </div>
        <input type="hidden" v-model="requestForm.hotelId" />
        <input type="hidden" v-model="requestForm.userId" />
        <div class="field mb-3">
          <label>Habitación</label>
          <pv-select
              v-model="requestForm.roomId"
              :options="props.rooms"
              optionLabel="roomNumber"
              optionValue="id"
              placeholder="Seleccione habitación"
              class="w-full"
              :filter="true"
              filterPlaceholder="Buscar habitación..."
              :appendTo="'body'"
              @update:modelValue="handleRoomSelect"
          >
            <template #option="slotProps">
              <div>{{ slotProps.option.roomNumber }} - {{ slotProps.option.type }}</div>
            </template>
          </pv-select>
        </div>

        <div class="field mb-3">
          <label>Tipo de petición</label>
          <pv-select
              v-model="requestForm.type"
              :options="props.requestTypes"
              placeholder="Seleccione tipo"
              class="w-full"
              @update:modelValue="handleFormUpdate"
          />
        </div>

        <div class="field mb-3">
          <label>Descripción</label>
          <pv-textarea
              v-model="requestForm.description"
              rows="3"
              placeholder="Detalles de la petición..."
              class="w-full"
              autoResize
              @update:modelValue="handleFormUpdate"
          />
        </div>

        <div class="field mb-3">
          <label>Prioridad</label>
          <pv-select
              v-model="requestForm.priority"
              :options="props.priorityOptions"
              placeholder="Seleccione prioridad"
              class="w-full"
              @update:modelValue="handleFormUpdate"
          >
            <template #option="slotProps">
              <div class="flex align-items-center gap-2">
                <i class="pi" :class="{
                  'pi-arrow-down': slotProps.option === 'Baja',
                  'pi-arrow-right': slotProps.option === 'Media',
                  'pi-arrow-up': slotProps.option === 'Alta',
                  'pi-exclamation-triangle': slotProps.option === 'Urgente'
                }"></i>
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </pv-select>
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <pv-button label="Cancelar" class="p-button-text" @click="emit('update:modelValue', false)" />
        <pv-button label="Guardar" type="submit" />
      </div>
    </form>
  </pv-dialog>
</template>