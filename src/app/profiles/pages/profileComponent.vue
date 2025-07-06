<template>
  <div class="p-4">
    <div v-if="loading" class="text-center py-8">
      <span>{{$t('profile.loading')}}</span>
    </div>
    <template v-else>
      <!-- ADMIN -->
      <template v-if="userRole === 'ADMIN'">
        <div class="hotel-title text-xl font-bold mb-4">
          {{ hotel?.name || $t('profile.hotel') }} - {{$t('profile.adminProfile')}}
        </div>
        <Card class="mb-5">
          <template #title>{{$t('profile.personalData')}}</template>
          <template #content>
            <ul class="list-none p-0 m-0">
              <li class="flex align-items-center mb-3">
                <i class="pi pi-user text-xl mr-3 text-primary"></i>
                <span><strong>{{$t('profile.name')}}:</strong> {{ fullName }}</span>
              </li>
              <li class="flex align-items-center mb-3">
                <i class="pi pi-envelope text-xl mr-3 text-primary"></i>
                <span><strong>{{$t('profile.email')}}:</strong> {{ profile?.email }}</span>
              </li>
              <li class="flex align-items-center mb-3">
                <i class="pi pi-phone text-xl mr-3 text-primary"></i>
                <span><strong>{{$t('profile.phone')}}:</strong> {{ profile?.phone }}</span>
              </li>
            </ul>
          </template>
        </Card>
        <Card>
          <template #title>
            <span class="hotel-name-title">{{ hotel?.name || $t('profile.hotel') }}</span>
          </template>
          <template #subtitle>
            <i class="pi pi-map-marker text-primary mr-2"></i>
            <span class="hotel-address">{{ hotel?.address || '' }}</span>
          </template>
          <template #content>
            <ul class="hotel-info-list">
              <li class="hotel-info-item">
                <span class="icon-wrapper" :style="{ background: getHotelStatusColor(hotel?.status) + '22' }">
                  <i :class="['pi', getHotelStatusIcon(hotel?.status), 'text-xl']" :style="{ color: getHotelStatusColor(hotel?.status) }"></i>
                </span>
                <span><strong>{{$t('profile.status')}}:</strong> <span class="hotel-status">{{ formatHotelStatus(hotel?.status) }}</span></span>
              </li>
              <li class="hotel-info-item">
                <i class="pi pi-home text-xl mr-2 text-info"></i>
                <span><strong>{{$t('profile.totalRooms')}}:</strong> <span class="hotel-data">{{ hotel?.totalRooms ?? 0 }}</span></span>
              </li>
              <li class="hotel-info-item">
                <i class="pi pi-lock-open text-xl mr-2 text-danger"></i>
                <span><strong>{{$t('profile.occupiedRooms')}}:</strong> <span class="hotel-data">{{ hotel?.occupiedRooms ?? 0 }}</span></span>
              </li>
              <li class="hotel-info-item">
                <i class="pi pi-refresh text-xl mr-2 text-warning"></i>
                <span><strong>{{$t('profile.cleaningRooms')}}:</strong> <span class="hotel-data">{{ hotel?.cleaningRooms ?? 0 }}</span></span>
              </li>
              <li class="hotel-info-item">
                <i class="pi pi-wrench text-xl mr-2 text-secondary"></i>
                <span><strong>{{$t('profile.maintenanceRooms')}}:</strong> <span class="hotel-data">{{ hotel?.maintenanceRooms ?? 0 }}</span></span>
              </li>
            </ul>
          </template>
        </Card>
        <Card class="mt-5">
          <template #title>{{$t('profile.subscription')}}</template>
          <template #content>
            <div v-if="subscription" class="flex align-items-center">
              <i class="pi pi-check-circle text-success text-2xl mr-3"></i>
              <div>
                <div class="font-bold">{{$t('profile.activeUntil')}}: {{ new Date(subscription.endDate).toLocaleDateString() }}</div>
              </div>
              <Button v-if="userRole === 'ADMIN'" icon="pi pi-times" class="p-button-danger ml-auto cancelar-btn fancy-cancel-btn" @click="eliminarSuscripcion">
                <span class="btn-label">{{$t('profile.cancelSubscription')}}</span>
              </Button>
            </div>
            <div v-else class="text-center text-gray-500 py-4">
              {{$t('profile.noActiveSubscription')}}
            </div>
          </template>
        </Card>
      </template>
      <!-- STAFF o GUEST -->
      <template v-else-if="userRole === 'STAFF' || userRole === 'GUEST'">
        <div class="hotel-title text-xl font-bold mb-4">
          {{$t('profile.profileOf')}} {{ userRole === 'STAFF' ? $t('profile.staff') : $t('profile.guest') }}
        </div>
        <Card class="mb-5">
          <template #title>{{$t('profile.personalData')}}</template>
          <template #content>
            <ul class="list-none p-0 m-0">
              <li class="flex align-items-center mb-3">
                <i class="pi pi-user text-xl mr-3 text-primary"></i>
                <span><strong>{{$t('profile.name')}}:</strong> {{ profile?.firstName }} {{ profile?.lastName }}</span>
              </li>
              <li class="flex align-items-center mb-3">
                <i class="pi pi-envelope text-xl mr-3 text-primary"></i>
                <span><strong>{{$t('profile.email')}}:</strong> {{ profile?.email }}</span>
              </li>
              <li class="flex align-items-center mb-3">
                <i class="pi pi-phone text-xl mr-3 text-primary"></i>
                <span><strong>{{$t('profile.phone')}}:</strong> {{ profile?.phone }}</span>
              </li>
            </ul>
          </template>
        </Card>
        <Card v-if="userRole === 'STAFF'">
          <template #title>{{$t('profile.associatedHotels')}}</template>
          <template #content>
            <ul class="list-none p-0 m-0">
              <li v-for="hotel in associatedHotels" :key="hotel.id" class="mb-4">
                <div class="font-bold">{{ hotel?.name }}</div>
                <div><i class="pi pi-map-marker mr-2"></i>{{ hotel?.address }}</div>
                <div><i class="pi pi-envelope mr-2"></i>{{ hotel?.email }}</div>
                <div><i class="pi pi-phone mr-2"></i>{{ hotel?.phone }}</div>
                <div><i :class="getHotelStatusIcon(hotel?.status)" class="mr-2" :style="{ color: getHotelStatusColor(hotel?.status) }"></i>{{ formatHotelStatus(hotel?.status) }}</div>
              </li>
              <li v-if="associatedHotels.length === 0">{{$t('profile.noAssociatedHotels')}}</li>
            </ul>
          </template>
        </Card>
        <template v-else-if="userRole === 'GUEST'">
          <!-- Se elimina la visualización del perfil para GUEST -->
        </template>
      </template>
      <template v-else>
        <div class="text-red-500 text-center py-4">
          {{$t('profile.unrecognizedRole')}}
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../shared/composables/useAuth.js'
import Card from 'primevue/card'
import { getHotels } from '../../crm/services/hotels.service.js'
import { getProfilesByHotelId, cancelSubscription, getProfileByUserId } from '../services/profile.service.js'
import { getSubscription } from '../../billing/services/payment.service.js'

const { user } = useAuth()
const userRole = computed(() => user.value?.role)

const hotel = ref(null)
const profile = ref(null)
const subscription = ref(null)
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true;
  try {
    // Obtener userId desde localStorage
    let userId = null;
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        userId = parsed.id;
      } catch (e) {
        console.error('No se pudo parsear userData para userId:', e);
      }
    }
    // Cargar perfil usando el endpoint /api/v1/profiles/userid/{userId} para todos los roles
    if (userId) {
      profile.value = await getProfileByUserId(userId);
    }
    // 1. Buscar el hotel por name usando el username del usuario autenticado
    const allHotels = await getHotels()
    console.log('Hoteles obtenidos:', allHotels)
    hotel.value = allHotels.find(h => h.name === user.value?.username)
    console.log('Hotel encontrado:', hotel.value)
    // 2. Buscar el profile por hotelId
    if (hotel.value?.id) {
      const profiles = await getProfilesByHotelId(hotel.value.id)
      console.log('Profiles obtenidos:', profiles)
      profile.value = Array.isArray(profiles)
        ? profiles.find(p => p.email === user.value?.email) || profiles[0]
        : profiles
      console.log('Profile encontrado:', profile.value)
      // 3. Buscar la suscripción por hotelId
      const subs = await getSubscription()
      console.log('Subscripciones obtenidas:', subs)
      // Asegurarse que subs es un array y buscar la suscripción correcta
      let foundSubscription = null
      if (Array.isArray(subs)) {
        foundSubscription = subs.find(s => s.hotelId === hotel.value.id)
      } else if (subs && subs.hotelId === hotel.value.id) {
        foundSubscription = subs
      }
      subscription.value = foundSubscription
      console.log('Suscripción encontrada:', subscription.value)
      // Ya no se obtiene el plan, solo se muestra la fecha de fin
    } else {
      console.warn('No se encontró hotel con el username del usuario')
    }
  } catch (e) {
    console.error('Error general en onMounted:', e)
    error.value = 'Error al cargar los datos del perfil'
  } finally {
    loading.value = false
    console.log('Finalizó onMounted')
  }
})

const fullName = computed(() => profile.value ? `${profile.value.firstName} ${profile.value.lastName}` : '')

const eliminarSuscripcion = async () => {
  if (!subscription.value?.id) return
  loading.value = true
  try {
    await cancelSubscription(subscription.value.id)
    subscription.value = null
  } catch (e) {
    error.value = 'No se pudo eliminar la suscripción.'
  } finally {
    loading.value = false
  }
}

// Métodos auxiliares
const formatHotelStatus = (status) => {
  const statuses = {
    Active: 'Abierto',
    Inactive: 'Inactivo',
    Maintenance: 'Mantenimiento',
    Pending: 'Pendiente'
  }
  return statuses[status] || status
}

const getHotelStatusIcon = (status) => {
  const icons = {
    active: 'pi-check-circle',
    inactive: 'pi-times-circle',
    maintenance: 'pi-exclamation-triangle',
    pending: 'pi-clock'
  }
  return icons[status] || 'pi-question'
}

const getHotelStatusColor = (status) => {
  const colors = {
    active: '#4caf50',
    inactive: '#f44336',
    maintenance: '#ff9800',
    pending: '#2196f3'
  }
  return colors[status] || '#9e9e9e'
}
</script>

<style scoped>
.hotel-title {
  color: #1a237e;
  letter-spacing: 1px;
}
.text-primary {
  color: #2196f3;
}
.text-success {
  color: #4caf50;
}
.text-info {
  color: #2196f3;
}
.text-danger {
  color: #f44336;
}
.text-warning {
  color: #ff9800;
}
.text-secondary {
  color: #9e9e9e;
}
.cancelar-btn {
  font-weight: bold;
  background-color: #f44336;
  border-color: #f44336;
}
.fancy-cancel-btn {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}
.fancy-cancel-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}
.hotel-name-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1a237e;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #e3e3e3;
}
.hotel-address {
  display: flex;
  align-items: center;
  font-size: 1.08rem;
  color: #444;
  font-style: italic;
  margin-bottom: 0.2rem;
}
.hotel-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #f8fafc;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.07);
}
.hotel-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.2rem 0.4rem 0.2rem;
  border-bottom: 1px solid #e0e0e0;
}
.hotel-info-item:last-child {
  border-bottom: none;
}
.hotel-status {
  font-weight: bold;
  color: #2196f3;
  margin-left: 0.2rem;
}
.hotel-data {
  font-weight: 600;
  color: #333;
  margin-left: 0.2rem;
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background: #e3e3e3;
}
</style>