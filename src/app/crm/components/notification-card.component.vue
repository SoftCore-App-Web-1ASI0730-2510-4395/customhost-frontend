<!-- src/app/guest-experience/components/NotificationCard.vue -->
<template>
  <pv-card
      class="notification-card shadow-1 transition-all transition-duration-300"
      :class="{ unread: !notification.read }"
      @click="markAsRead"
  >
    <template #title>
      <div class="flex justify-content-between align-items-center">
        {{ notification.title }}
        <pv-badge :severity="notification.severity">{{ notification.type }}</pv-badge>
      </div>
    </template>

    <template #content>
      <p>{{ notification.message }}</p>
      <small class="text-gray-500">{{ notification.formattedDate }}</small>
    </template>
  </pv-card>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const facade = {
      markNotificationAsRead: async (id) => {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        await axios.patch(`${API_URL}/notifications/${id}`, { read: true });
      }
    };

    const markAsRead = async () => {
      if (!props.notification.read) {
        await facade.markNotificationAsRead(props.notification.id);
        props.notification.read = true;
      }
    };

    return {
      markAsRead
    };
  }
};
</script>

<style scoped>
.notification-card {
  cursor: pointer;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.notification-card.unread {
  font-weight: bold;
  border-left: 4px solid #4caf50;
  background-color: #f8fff5;
}
</style>