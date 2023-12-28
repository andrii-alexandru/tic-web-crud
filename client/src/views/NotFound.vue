<template>
  <default_layout>
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  </default_layout>
</template>

<script>
import default_layout from '../components/default_layout.vue'
export default {
  components: {
    default_layout
  },
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
  padding: 1rem;
}
.not-found h1 {
  font-size: 5rem;
  color: var(--el-text-color-primary);
}
.not-found p {
  font-size: 2rem;
  color: var(--el-text-color-secondary);
}
</style>
