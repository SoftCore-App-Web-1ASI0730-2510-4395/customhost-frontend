<!-- src/components/RoomCard.vue -->
<template>
  <pv-card class="room-card" @click="select">
    <template #title>
      Habitación {{ room.roomNumber }} - {{ room.type }}
    </template>
    <template #content>
      <div class="flex align-items-center justify-content-between">
        <span><strong>Piso:</strong> {{ room.floor }}</span>
        <pv-badge severity="success">Disponible</pv-badge>
      </div>
      <p class="mt-2"><strong>Precio:</strong> ${{ room.price }} USD</p>
    </template>
  </pv-card>
</template>

<script>
export default {
  props: {
    room: {
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
.room-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.room-card:hover {
  transform: scale(1.02);
}

</style>