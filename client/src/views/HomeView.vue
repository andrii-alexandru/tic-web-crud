<script setup>
import AppLogo from '../components/AppLogo.vue'
import DefaultLayout from '../components/default_layout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="homepage">
      <AppLogo></AppLogo>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.homepage {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>
