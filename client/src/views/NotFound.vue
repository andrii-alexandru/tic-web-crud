<template>
  <default_layout>
    <div class="not-found">
      <el-text size="large" class="title" tag="b">404 - PAGE NOT FOUND</el-text>
      <el-empty description="The page you are looking for does not exist.">
        <el-link type="primary" href="/"
          >Go to Home Page &nbsp;<el-icon><Right /></el-icon
        ></el-link>
      </el-empty>
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
  padding: 4rem;
}
.not-found .title {
  font-size: 2rem;
  word-break: break-word !important;
}
.not-found p {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
}
</style>
