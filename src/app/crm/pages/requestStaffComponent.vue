<script>
import { Drawer as PvDrawer } from "primevue";
import { getRooms } from '../services/crm-services.js'; // Importa la función getRooms de tu API

export default {
  name: "side-bar",
  components: { PvDrawer },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  data() {
    return {
      userType: 'staff', // 'guest', 'staff', or 'admin'
      rooms: [] // Inicializamos vacío, luego lo llenamos con la API
    };
  },
  computed: {
    sidebar_items() {
      return [
        {
          name: this.$t('sidebar_items.home'),
          path: '/home',
          type: 'both',
          icon: 'pi pi-home',
        },
        {
          name: this.$t('sidebar_items.profile'),
          path: '/profiles/profile',
          type: 'both',
          icon: 'pi pi-user'
        },
        {
          name: this.$t('sidebar_items.preferences'),
          path: '/profiles/preferences',
          type: 'guest',
          icon: 'pi pi-cog'
        },
        {
          name: this.$t('sidebar_items.book'),
          path: '/crm/book',
          type: 'guest',
          icon: 'pi pi-calendar-plus'
        },
        {
          name: this.$t('sidebar_items.my-bookings'),
          path: '/crm/my-bookings',
          type: 'guest',
          icon: 'pi pi-list'
        },
        {
          name: this.$t('sidebar_items.customer-service'),
          path: '/crm/customer-service',
          type: 'guest',
          icon: 'pi pi-comments'
        },
        {
          name: this.$t('sidebar_items.admin'),
          path: '/billing/admin',
          type: 'admin',
          icon: 'pi pi-shield'
        },
        {
          name: this.$t('sidebar_items.iot-devices'),
          path: '/guest-experience/iot-devices',
          type: 'staff',
          icon: 'pi pi-mobile'
        },
        {
          name: this.$t('sidebar_items.customer-requests'),
          path: '/crm/customer-requests',
          type: 'staff',
          icon: 'pi pi-inbox'
        },
        {
          name: this.$t('sidebar_items.bookings-tracker'),
          path: '/crm/bookings-tracker',
          type: 'staff',
          icon: 'pi pi-chart-line'
        },
        {
          name: this.$t('sidebar_items.request-staff'),
          path: '/crm/request-staff',
          type: 'staff',
          icon: 'pi pi-users'
        },
      ];
    },
    filteredItems() {
      return this.sidebar_items.filter(item => {
        return item.type === this.userType || item.type === 'both'
      });
    }
  },
  methods: {
    updateVisibility() {
      this.$emit('update:visible', false);
    },
    isActive(path) {
      return this.$route.path === path;
    },
    async fetchRooms() {
      try {
        // Llamada a la API para obtener las habitaciones
        this.rooms = await getRooms();
      } catch (error) {
        console.error('Error al obtener las habitaciones:', error.message);
      }
    }
  },
  created() {
    this.fetchRooms(); // Llamamos la función para obtener las habitaciones desde la API al crear el componente
  }
}
</script>
