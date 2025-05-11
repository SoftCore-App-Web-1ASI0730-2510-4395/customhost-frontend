<script>
import SidebarComponent from "./app/public/components/sidebarComponent.vue";
import HeaderBar from "./app/public/components/headerComponent.vue";
export default {
  name: "App",
  components: {HeaderBar, SideBar: SidebarComponent},
  methods:{

  },
  data() {
    return {
      isAuthPath: false,
      isSideBarVisible: true
    }
  },

};
</script>

<template>
  <div>
    <header-bar v-if="!isAuthPath" v-model:visible="isSideBarVisible"/>
    <side-bar v-if="!isAuthPath" v-model:visible="isSideBarVisible" />
  </div>

  <router-view />
</template>
<style scoped>

</style>
