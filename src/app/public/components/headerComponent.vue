<script>
import {SelectButton as PvSelectButton, Toolbar as PvToolbar} from "primevue";
import LanguageSwitcher from "./languageSwitcher.component.vue";

export default {
  name: "headerBar",
  components: {LanguageSwitcher, PvSelectButton, PvToolbar},
  emits: ['update:visible'],
  props: {
    visible: {
      type: Boolean,
      required: true,
    }
  },
  methods:{
    toggleMenu() {
      this.$emit('update:visible', true);
    }
  }
}
</script>

<template>
  <pv-toolbar style="background: var(--color-secondary); color: var(--color-primary-light);">
    <template #start >
      <div class="flex gap-3 justify-content-center align-items-center">
        <button class="border-none bg-transparent cursor-pointer" @click="toggleMenu">
          <i class="pi pi-bars" />
        </button>
        <span class="font-semibold text-2xl">Custom Host</span>
      </div>

    </template>
    <template #end>
      <language-switcher />
    </template>
  </pv-toolbar>
</template>

<style scoped>
  span{
    font-family: "Anta", sans-serif;
    letter-spacing: max(1px, 0.1vw);
  }
  button{
    color: var(--color-primary-light);
  }
</style>