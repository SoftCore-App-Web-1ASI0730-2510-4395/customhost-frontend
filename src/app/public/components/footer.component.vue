<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} Hotel Sheraton Center. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: var(--color-secondary); /* Mismo fondo que el header */
  color: var(--color-primary-light); /* Mismo color de texto que el header */
  padding: 1rem 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Borde sutil */
  font-size: 0.9rem;
  width: 100%;
  /* Elimina position: fixed y bottom para sticky footer */
}

.footer-content {
  width: 100%;
}

body, .app-layout, #app {
  padding-bottom: 60px !important;
}
</style>