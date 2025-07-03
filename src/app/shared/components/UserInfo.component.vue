<template>
  <div v-if="isAuthenticated" class="user-info-dropdown">
    <!-- Trigger del dropdown -->
    <div 
      class="user-trigger"
      @click="toggleDropdown"
      ref="trigger"
    >
      <i :class="getRoleIcon(userRole)" class="user-icon"></i>
      <span class="username">{{ user.username }}</span>
      <i class="pi pi-chevron-down dropdown-arrow" :class="{ 'rotated': isDropdownOpen }"></i>
    </div>

    <!-- Dropdown Menu -->
    <div 
      v-if="isDropdownOpen" 
      class="dropdown-menu"
      ref="dropdown"
    >
      <div class="user-info-header">
        <i :class="getRoleIcon(userRole)" class="role-icon-large"></i>
        <div class="user-details">
          <span class="display-name">{{ user.username }}</span>
          <span class="role-badge" :class="getRoleClass(userRole)">{{ userRole }}</span>
        </div>
      </div>
      
      <div class="menu-divider"></div>
      
      <div class="menu-options">
        <button class="menu-option" @click="handleLogout">
          <i class="pi pi-sign-out"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>

    <!-- Overlay para cerrar dropdown -->
    <div 
      v-if="isDropdownOpen" 
      class="dropdown-overlay"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth.js';

const router = useRouter();
const { user, isAuthenticated, userRole, logout } = useAuth();

// Estado del dropdown
const isDropdownOpen = ref(false);
const trigger = ref(null);
const dropdown = ref(null);

function getRoleIcon(role) {
  switch (role) {
    case 'ADMIN':
      return 'pi pi-crown'; // Corona para admin
    case 'STAFF':
      return 'pi pi-star'; // Estrella para staff
    case 'GUEST':
      return 'pi pi-user'; // Usuario para guest
    default:
      return 'pi pi-user';
  }
}

function getRoleClass(role) {
  switch (role) {
    case 'ADMIN':
      return 'role-admin';
    case 'STAFF':
      return 'role-staff';
    case 'GUEST':
      return 'role-guest';
    default:
      return 'role-default';
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}

function handleLogout() {
  logout();
  closeDropdown();
  router.push('/iam/login');
}

// Cerrar dropdown cuando se hace click fuera
function handleClickOutside(event) {
  if (trigger.value && dropdown.value) {
    if (!trigger.value.contains(event.target) && !dropdown.value.contains(event.target)) {
      closeDropdown();
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.user-info-dropdown {
  position: relative;
  display: inline-block;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid transparent;
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-icon {
  font-size: 1.1rem;
  color: var(--color-primary-light, #ffffff);
}

.username {
  font-weight: 500;
  color: var(--color-primary-light, #ffffff);
  font-size: 0.9rem;
}

.dropdown-arrow {
  font-size: 0.8rem;
  color: var(--color-primary-light, #ffffff);
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.role-icon-large {
  font-size: 1.5rem;
  color: #495057;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.display-name {
  font-weight: 600;
  color: #212529;
  font-size: 1rem;
}

.role-badge {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  align-self: flex-start;
}

.role-admin {
  background: #fee2e2;
  color: #dc2626;
}

.role-staff {
  background: #fef3c7;
  color: #d97706;
}

.role-guest {
  background: #dbeafe;
  color: #2563eb;
}

.role-default {
  background: #f3f4f6;
  color: #6b7280;
}

.menu-divider {
  height: 1px;
  background: #e5e7eb;
}

.menu-options {
  padding: 0.5rem;
}

.menu-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
  font-size: 0.9rem;
}

.menu-option:hover {
  background: #f3f4f6;
  color: #111827;
}

.menu-option i {
  font-size: 1rem;
  color: #6b7280;
}

.menu-option:hover i {
  color: #374151;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .dropdown-menu {
    right: -1rem;
    min-width: 220px;
  }
  
  .username {
    display: none;
  }
  
  .user-trigger {
    padding: 0.5rem;
  }
}
</style>
