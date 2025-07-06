<!-- src/dashboard/pages/GuestDashboardPage.vue -->
<template>
  <div class="surface-section px-6 py-8">

    <!-- 1. Hero + Búsqueda rápida -->
    <!-- 1. Hero + Búsqueda rápida -->
    <div class="text-4xl font-extrabold text-center mb-8 text-gray-800">
      {{$t('guestHome.welcome', { name: usuarioNombre })}}
    </div>

    <div class="flex justify-center mb-24">
      <div class="relative w-full md:w-1/2">
        <input
            type="text"
            :placeholder="$t('guestHome.searchRoom')"
            v-model="searchQuery"
            @input="handleInput"
            @focus="showDropdown = true"
            @keyup.enter="handleEnter"
            class="w-full p-3 border rounded-lg shadow bg-gray-50"
        />
        <div
            v-if="showDropdown"
            class="absolute left-0 right-0 top-full mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto text-gray-900"
        >
          <div
              v-for="item in filteredSidebarItems"
              :key="item.key"
              @click="handleSelectSidebarItem(item)"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            {{ item.name() }}
          </div>
        </div>
      </div>
    </div>
    <div class="mb-30px"></div>

    <!-- 2. Notificaciones (máx. 3) -->
    <div class="text-3xl font-bold text-gray-800 mb-4 mt-20">Notificaciones</div>

    <div v-if="loadingNotifications" class="flex justify-center mb-8">
      <pv-progress-spinner />
    </div>

    <div v-else-if="notifications.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
      <div
          v-for="note in limitedNotifications"
          :key="note.id"
          class="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-400"
      >
        <NotificationCard :notification="note" />
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center mb-8">
      <i class="pi pi-bell-slash text-6xl text-gray-300 mb-3"></i>
      <span class="text-xl text-gray-500">No tienes notificaciones.</span>
    </div>

    <button
        v-if="notifications.length > 3"
        class="block mx-auto bg-transparent text-green-600 font-medium hover:underline mb-12"
        @click="goToAllNotifications"
    >
      Ver todas mis notificaciones
    </button>

    <!-- 3. Mis reservas -->
    <h2 class="text-3xl font-bold text-gray-800 mb-2">Mis reservas</h2>
    <div class="mb-30px"></div>
    <div v-if="loadingBookings" class="flex justify-center mb-8">
      <pv-progress-spinner />
    </div>

    <div v-else-if="bookings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div
          v-for="booking in bookings"
          :key="booking.id"
          class="col-span-1"
      >
        <BookingCard
            :booking="booking"
            mode="view"
            @view-booking="handleViewBooking"
            class="w-full shadow-lg rounded-2xl"
        />
      </div>
    </div>

    <div v-if="!loadingBookings && bookings.length > 0" class="flex justify-center mb-6">
      <button
          class="nueva-reserva-btn flex items-center bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 mx-auto"
          @click="goNewBooking"
      >
        <i class="pi pi-plus mr-2 text-lg transition-colors duration-300"></i> NUEVA RESERVA
      </button>
    </div>

    <div v-else class="flex flex-col items-center justify-center">
      <i class="pi pi-calendar-times text-6xl text-gray-300 mb-3"></i>
      <span class="text-xl text-gray-500">No tienes reservas activas.</span>
    </div>


  </div>
</template>




<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from '../../shared/composables/useAuth.js';
import { homeFacade } from '../services/home.facade.js';
import NotificationCard from '../../crm/components/guests/notification-card.component.vue';
import BookingCard from '../../crm/components/guests/booking-card.component.vue';

export default {
  components: { NotificationCard, BookingCard },
  setup() {
    // <-- 1) i18n dentro de setup
    const { t } = useI18n();
    const router = useRouter();
    const { user } = useAuth();

    const usuarioNombre      = computed(() => user.value?.username || 'Usuario'); // Dinámico desde sesión
    const searchQuery        = ref('');
    const showDropdown       = ref(false);

    const notifications      = ref([]);
    const loadingNotifications = ref(true);
    const bookings           = ref([]);
    const loadingBookings    = ref(true);

    // <-- 2) guestSidebarItems dentro de setup
    const guestSidebarItems = [
      {
        key: 'home',
        name: () => t('sidebar_items.home'),
        path: '/guest-home',
        alt: ['home']
      },
      {
        key: 'book-now',
        name: () => t('sidebar_items.book-now'),
        path: '/crm/guest/hotel-room-selection',
        alt: ['book', 'reservar']
      },
      {
        key: 'preferences',
        name: () => t('sidebar_items.preferences'),
        path: '/guest-experience/preferences',
        alt: ['preferences']
      },
      {
        key: 'my-bookings',
        name: () => t('sidebar_items.my-bookings'),
        path: '/crm/my-bookings',
        alt: ['bookings', 'reservas']
      },
      {
        key: 'customer-service',
        name: () => t('sidebar_items.customer-service'),
        path: '/crm/customer-service',
        alt: ['customer service']
      },
      {
        key: 'notifications',
        name: () => t('sidebar_items.notifications'),
        path: '/crm/guest/notifications',
        alt: ['notificacion', 'notificaciones', 'notification', 'notifications']
      }
    ];

    // Carga datos
    const loadNotifications = async () => {
      loadingNotifications.value = true;
      try { notifications.value = await homeFacade.getGuestNotifications(1) }
      finally { loadingNotifications.value = false }
    };
    const loadBookings = async () => {
      loadingBookings.value = true;
      try { bookings.value = await homeFacade.getGuestBookings(1) }
      finally { loadingBookings.value = false }
    };
    onMounted(() => { loadNotifications(); loadBookings() });

    // Helpers
    const normalize = str =>
        str
            ? str.normalize('NFD').replace(/[\u0300-\u036f\s]/g, '').toLowerCase()
            : '';
    const filteredSidebarItems = computed(() => {
      if (!searchQuery.value) return [];
      const q = normalize(searchQuery.value);
      return guestSidebarItems.filter(item => {
        const label = normalize(item.name());
        const matchesLabel = label.includes(q);
        const matchesAlt = item.alt.some(a => normalize(a).includes(q) || q.includes(normalize(a)));
        return matchesLabel || matchesAlt;
      });
    });
    const limitedNotifications = computed(() => notifications.value.slice(0, 3));

    // Eventos de búsqueda
    function handleInput() {
      showDropdown.value = !!searchQuery.value && filteredSidebarItems.value.length > 0;
    }
    function handleSelectSidebarItem(item) {
      showDropdown.value = false;
      searchQuery.value = '';
      router.push(item.path);
    }
    function handleEnter() {                      // <-- 3) sin parámetro e
      if (filteredSidebarItems.value.length) {
        handleSelectSidebarItem(filteredSidebarItems.value[0]);
      }
    }

    // Navegación auxiliar
    const goToAllNotifications = () => router.push({ name: 'notifications' });
    const goNewBooking         = () => router.push({ name: 'hotel-room-selection' });
    const handleViewBooking    = () => router.push({ name: 'MyBookings' });

    return {
      usuarioNombre,
      searchQuery,
      showDropdown,
      filteredSidebarItems,
      handleInput,
      handleEnter,
      handleSelectSidebarItem,

      notifications,
      loadingNotifications,
      limitedNotifications,
      goToAllNotifications,

      bookings,
      loadingBookings,
      handleViewBooking,
      goNewBooking
    };
  }
};
</script>



<style>
.surface-section {
  background-color: #f9fafb;
}
.text-gray-800 {
  color: #1f2937;
}
.bg-white {
  background: #ffffff;
}
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
.rounded-2xl {
  border-radius: 1rem;
}
.border-green-400 {
  border-color: #34d399;
}
.bg-green-500 {
  background-color: #10b981;
}
.hover\:bg-green-600:hover {
  background-color: #059669;
}
.mb-30px {
  margin-bottom: 30px;
}
.nueva-reserva-btn {
  border-radius: 18px;
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  outline: none;
  cursor: pointer;
}
.nueva-reserva-btn:hover, .nueva-reserva-btn:focus {
  background: #059669;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.18);
  transform: translateY(-2px) scale(1.03);
}
</style>