<!-- src/app/crm/components/guests/room/hotel-card.component.vue -->
<template>
  <pv-card class="hotel-card" @click="select">
    <template #title>
      {{ hotel.name }}
    </template>
    <template #content>
      <p>{{ hotel.address }}</p>
      <p><strong>Teléfono:</strong> {{ hotel.phone }}</p>
      <p><strong>Email:</strong> {{ hotel.email }}</p>
    </template>
  </pv-card>
</template>

<script>
export default {
  props: {
    hotel: {
      type: Object,
      required: true
    }
  },
  emits: ['select'],
  setup(_, { emit }) {
    const select = () => {
      emit('select');
    };

    return { select };
  }
};
</script>

<style scoped>
.hotel-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.hotel-card:hover {
  transform: scale(1.02);
}
</style>