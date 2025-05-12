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
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #e9ecef;
  font-size: 0.9rem;
  color: #495057;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>