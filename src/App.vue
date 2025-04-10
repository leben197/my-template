<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router';

</script>

<style lang="scss">
.hidden {
  display: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
