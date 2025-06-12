<template>
  <Dialog v-model:visible="roomDialog" modal header="Room Form" :style="{ width: '400px' }" @update:visible="$emit('update:modelValue', $event)">
    <form @submit.prevent="$emit('save')">
      <div class="p-fluid">
        <div class="field mb-3">
          <label>Hotel Id</label>
          <InputText v-model="room.hotelId" required />
        </div>
        <div class="field mb-3">
          <label>Room Number</label>
          <InputText v-model="room.number" required />
        </div>
        <div class="field mb-3">
          <label>Type</label>
          <InputText v-model="room.type" required />
        </div>
        <div class="field mb-3">
          <label>Status</label>
          <Dropdown v-model="room.status" :options="statusOptions" placeholder="Select status" />
        </div>
        <div class="field mb-3">
          <label>Price</label>
          <InputNumber v-model="room.price" mode="currency" currency="USD" locale="en-US" />
        </div>
        <div class="field mb-3">
          <label>Floor</label>
          <InputNumber v-model="room.floor" />
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button label="Cancel" class="p-button-text" @click="closeDialog" />
        <Button label="Save" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: Boolean,
  room: Object,
  statusOptions: Array
})

const emit = defineEmits(['update:modelValue', 'save'])

const closeDialog = () => {
  emit('update:modelValue', false)
}
</script>