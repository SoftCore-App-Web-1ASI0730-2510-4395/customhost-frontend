<template>
  <header class="header p-3 border-bottom-1">
    <div class="flex justify-content-between align-items-center">

      <!-- Logo o título -->
      <div class="logo font-bold text-xl">
        Custom host
      </div>

      <!-- Grupo de acciones -->
      <div class="flex align-items-center gap-4">

        <!-- Switch de idioma -->
        <div class="language-switcher flex align-items-center gap-2">
          <span :class="{ active: currentLang === 'es' }" @click="changeLang('es')">ES</span>
          |
          <span :class="{ active: currentLang === 'en' }" @click="changeLang('en')">EN</span>
        </div>

        <!-- Nombre de usuario estático -->
        <div class="user-info flex align-items-center gap-2">
          <i class="pi pi-user text-lg"></i>
          <span>Juan Pérez</span>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const currentLang = ref('es')

const changeLang = (lang) => {
  currentLang.value = lang
  // Aquí puedes conectar con i18n si lo usas
  console.log(`Cambiando a idioma: ${lang}`)
}
</script>

<style scoped>
.header {
  background-color: #1a237e; /* Azul oscuro principal */
  color: #ffffff; /* Texto blanco para contraste */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  color: #ffffff; /* Blanco para contraste con fondo oscuro */
  letter-spacing: 1px;
}

.language-switcher span {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
  color: #bbdefb; /* Azul claro para texto secundario */
}

.language-switcher span:hover {
  color: #ffffff; /* Blanco al hover */
}

.language-switcher .active {
  font-weight: bold;
  color: #ffffff; /* Blanco para el idioma activo */
  text-decoration: underline;
}

.user-info i {
  color: #bbdefb; /* Azul claro para el icono */
}

.user-info span {
  color: #ffffff; /* Blanco para el nombre de usuario */
}

/* Borde inferior sutil */
.border-bottom-1 {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>