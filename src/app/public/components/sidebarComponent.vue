<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from '../../shared/composables/useAuth.js';
import { Drawer as PvDrawer } from "primevue";

// Props y emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible']);

// Composables
const route = useRoute();
const { t } = useI18n();
const { userRole } = useAuth();

// Mapeo de roles para compatibilidad con el sidebar existente
const userType = computed(() => {
  switch (userRole.value) {
    case 'ADMIN':
      return 'staff'; // Los admins ven el menú de staff
    case 'STAFF':
      return 'staff';
    case 'GUEST':
      return 'guest';
    default:
      return 'guest'; // Fallback por defecto
  }
});

// Methods
function updateVisibility() {
  emit('update:visible', false);
}

function isActive(path) {
  return route.path === path;
}

// Computed properties
const sidebar_items = computed(() => {
  return [
    //staff
    {
      name: t('sidebar_items.home'),
      path: '/staff-home',
      type: 'staff',
      icon: 'pi pi-home',
    },
    {
      name: t('sidebar_items.rooms'),
      path: '/crm/rooms',
      type: 'staff',
      icon: 'pi pi-building',
    },
    {
      name: t('sidebar_items.staff-devices'),
      path: '/guest-experience/staff-devices',
      type: 'staff',
      icon: 'pi pi-mobile'
    },
    {
      name: t('sidebar_items.customer-requests'),
      path: '/crm/customer-requests',
      type: 'staff',
      icon: 'pi pi-inbox'
    },
    {
      name: t('sidebar_items.bookings-tracker'),
      path: '/crm/bookings-tracker',
      type: 'staff',
      icon: 'pi pi-chart-line'
    },
    {
      name: t('sidebar_items.request-staff'),
      path: '/crm/request-staff',
      type: 'staff',
      icon: 'pi pi-users'
    },

    //guest
    {
      name: t('sidebar_items.home'),
      path: '/guest-home',
      type: 'guest',
      icon: 'pi pi-home',
    },
    {
      name: t('sidebar_items.book-now'),
      path: '/crm/guest/hotel-room-selection',
      type: 'guest',
      icon: 'pi pi-building', // Mejor icono para habitaciones
    },
    {
      name: t('sidebar_items.preferences'),
      path: '/guest-experience/preferences',
      type: 'guest',
      icon: 'pi pi-cog'
    },
    {
      name: t('sidebar_items.my-bookings'),
      path: '/crm/my-bookings',
      type: 'guest',
      icon: 'pi pi-list'
    },
    {
      name: t('sidebar_items.customer-service'),
      path: '/crm/customer-service',
      type: 'guest',
      icon: 'pi pi-comments'
    },
    {
      name: t('sidebar_items.notifications'),
      path: '/crm/guest/notifications',
      type: 'guest',
      icon: 'pi pi-cog'
    },

    //ambos
    {
      name: t('sidebar_items.profile'),
      path: '/profiles/profile',
      type: 'both',
      icon: 'pi pi-user'
    },
  ];
});

const filteredItems = computed(() => {
  return sidebar_items.value.filter(item => {
    return item.type === userType.value || item.type === 'both';
  });
});
</script>

<template>
  <PvDrawer
      :visible="visible"
      :dismissable="true"
      @update:visible="updateVisibility"
      style="background: var(--color-secondary-light); color: var(--color-slate); border: none"
  >
    <div class="sidebar-header">
      <h3 class="text-2xl">{{ $t('dashboard.title') }}</h3>
    </div>
    <div class="sidebar-content">
      <ul class="sidebar-menu">
        <li v-for="item in filteredItems" :key="item.path"
            :class="{ 'active': isActive(item.path) }">
            <router-link :to="item.path">
              <div class="menu-item">
                <i v-if="item.icon" :class="item.icon"></i>
                <span class="menu-label">{{ item.name }}</span>
              </div>
            </router-link>
        </li>
      </ul>
    </div>
  </PvDrawer>
</template>

<style scoped>

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-content {
  padding: 0.5rem 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.sidebar-menu li:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.menu-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
}

.sidebar-menu li.active {
  background-color: #272727;
  border-left: 3px solid #fa8f45;
}

.sidebar-menu li.active .menu-item {
  color: #fa8f45;
}

.menu-label {
  margin-left: 0.75rem;
}

i {
  font-size: 1.25rem;
}
</style>