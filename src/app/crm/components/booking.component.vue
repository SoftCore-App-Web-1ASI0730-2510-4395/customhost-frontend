<template>
  <div class="room-card">
    <div class="room-header">
      <h3>{{ room.type }}</h3>
      <span class="price">${{ room.price }}</span>
    </div>

    <div class="room-body">
      <p><strong>Número:</strong> {{ room.number }}</p>
      <p><strong>Piso:</strong> {{ room.floor }}</p>
      <p><strong>Estado:</strong> <span :class="statusClass">{{ room.status }}</span></p>
    </div>

    <div class="room-footer">
      <button @click="$emit('select', room)" class="btn-select">Seleccionar</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
});

const statusClass = computed(() => {
  return props.room.status === 'Available' ? 'status-available' : 'status-unavailable';
});
</script>

<style scoped>
.room-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.room-card:hover {
  transform: translateY(-4px);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  color: #fa8f45;
}

.room-body p {
  margin: 0.3rem 0;
}

.status-available {
  color: green;
  font-weight: bold;
}

.status-unavailable {
  color: red;
  font-weight: bold;
}

.btn-select {
  width: 100%;
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>