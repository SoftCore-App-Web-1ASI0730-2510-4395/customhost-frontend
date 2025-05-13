<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} Hotel Cheraton Center. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #1a237e; /* Mismo azul oscuro que el header */
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Borde sutil claro */
  font-size: 0.9rem;
  color: #ffffff; /* Texto blanco para contraste */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer a {
  color: #bbdefb; /* Azul claro para enlaces (si los añades) */
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer a:hover {
  color: #ffffff; /* Blanco al hacer hover */
  text-decoration: underline;
}
</style>