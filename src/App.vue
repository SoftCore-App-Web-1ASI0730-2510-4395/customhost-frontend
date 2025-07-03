<script>
import SidebarComponent from "./app/public/components/sidebarComponent.vue";
import HeaderBar from "./app/public/components/headerComponent.vue";
import FooterComponent from "./app/public/components/footer.component.vue"; // Importamos el footer

export default {
  name: "App",
  components: {
    HeaderBar,
    SideBar: SidebarComponent,
    FooterComponent
  },
  methods: {},
  data() {
    return {
      isAuthPath: false,
      isSideBarVisible: !this.isAuthPath,
    };
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(newPath) {
        this.isAuthPath = newPath.includes('iam/');
      }
    }
  },
};
</script>

<template>
  <div class="app-layout">
    <!-- Header y Sidebar -->
    <header-bar v-if="!isAuthPath" v-model:visible="isSideBarVisible" />
    <side-bar v-if="!isAuthPath" v-model:visible="isSideBarVisible" />
    <!-- Contenido principal -->
    <main class="main-content">
      <router-view />
    </main>
    <!-- Footer -->
    <footer-component />
  </div>
</template>

<style>
.app-layout {
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1 0 auto;
  min-height: 60vh;
  padding-top: 0;
}
</style>