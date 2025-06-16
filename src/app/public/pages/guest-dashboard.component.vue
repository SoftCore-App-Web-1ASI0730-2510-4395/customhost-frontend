<!-- src/dashboard/pages/GuestDashboardPage.vue -->
<template>
  <div class="surface-section px-4 py-8">
    <div class="text-4xl font-bold text-center mb-6">Bienvenido, {{ userName }}</div>

    <!-- Estadísticas y resumen rápido -->
    <div class="grid mb-6">
      <div class="col-12 md:col-4">
        <GuestBookingSummary :booking="dashboard.currentBooking" />
      </div>
      <div class="col-12 md:col-4">
        <GuestRoomCard :room="dashboard.currentRoom" />
      </div>
      <div class="col-12 md:col-4">
        <GuestIotPreferencesCard :roomId="dashboard.currentRoom?.id" />
      </div>
    </div>

    <!-- Notificaciones + Recomendaciones -->
    <div class="grid">
      <div class="col-12 md:col-6">
        <GuestNotificationsCard :notifications="dashboard.notifications" />
      </div>
      <div class="col-12 md:col-6">
        <GuestSuggestionsCard />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import GuestBookingSummary from '@/dashboard/components/GuestBookingSummary.vue';
import GuestRoomCard from '@/dashboard/components/GuestRoomCard.vue';
import GuestNotificationsCard from '@/dashboard/components/GuestNotificationsCard.vue';
import GuestIotPreferencesCard from '@/dashboard/components/GuestIotPreferencesCard.vue';
import GuestSuggestionsCard from '@/dashboard/components/GuestSuggestionsCard.vue';
import GuestFacade from '@/dashboard/application/guest.facade';
import { useRouter } from 'vue-router';

export default {
  components: {
    GuestBookingSummary,
    GuestRoomCard,
    GuestNotificationsCard,
    GuestIotPreferencesCard,
    GuestSuggestionsCard
  },
  setup() {
    const router = useRouter();
    const dashboard = ref({
      currentBooking: null,
      currentRoom: null,
      notifications: [],
      activeBookingsCount: 0,
      pendingRequestsCount: 0,
      unreadNotificationsCount: 0
    });
    const userName = ref('Huésped');

    const loadDashboard = async () => {
      try {
        const userId = 1; // TODO: Obtener desde sesión
        const data = await GuestFacade.getGuestDashboardData(userId);
        dashboard.value = data;

        // Nombre del usuario (ejemplo)
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          userName.value = `${user.firstName} ${user.lastName}`;
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error);
        router.push({ name: 'Login' });
      }
    };

    onMounted(() => {
      loadDashboard();
    });

    return {
      dashboard,
      userName
    };
  }
};
</script>