<!-- src/app/guest-experience/pages/NotificationsPage.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <div class="text-3xl font-bold text-center mb-6">Notificaciones</div>

    <div v-if="loading" class="flex justify-content-center mt-6">
      <pv-progress-spinner />
    </div>

    <div v-else-if="notifications.length > 0" class="grid">
      <div v-for="notification in notifications" :key="notification.id" class="col-12 md:col-6 lg:col-4">
        <NotificationCard :notification="notification" />
      </div>
    </div>

    <div v-else class="flex flex-column align-items-center justify-content-center mt-6">
      <i class="pi pi-bell-slash text-6xl text-gray-400 mb-3"></i>
      <span class="text-xl text-center text-gray-600">No tienes notificaciones.</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import GuestFacade from '../../application/guest.facade';
import NotificationCard from '../../components/guests/notification-card.component.vue';

export default {
  components: { NotificationCard },
  setup() {
    const notifications = ref([]);
    const loading = ref(true);

    const loadNotifications = async () => {
      loading.value = true;
      try {
        const userId = 1; // TODO: Obtener desde sesión
        const data = await GuestFacade.getGuestNotifications(userId);
        notifications.value = data;
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadNotifications();
    });

    return {
      notifications,
      loading
    };
  }
};
</script>

<style>
.text-3xl{
  color: black;
}
</style>