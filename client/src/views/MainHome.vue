<script setup>
import DefaultLayout from '../components/default_layout.vue'
import app_logo from '../components/app_logo.vue'
</script>

<template>
  <DefaultLayout>
    <div class="homepage mt-20">
      <app_logo></app_logo>
      <h1>Welcome to Quotes & Authors CRUD App!</h1>
      <p>
        Explore the wisdom of words as you journey through a collection of inspiring and
        thought-provoking quotes. Immerse yourself in the power of language, where every quote tells
        a unique story and imparts a valuable lesson. Whether you seek motivation, reflection, or
        simply a moment of inspiration, this app is your gateway to a world of profound insights.
        Enjoy the seamless experience of creating, reading, updating, and deleting quotes
        effortlessly. Let the words resonate and uplift your spirits.
      </p>
      <el-link type="primary" href="/quotes">
        <el-icon><DArrowRight /></el-icon>
        &nbsp; Explore the quotes
      </el-link>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.homepage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}
.homepage h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  padding: 1rem;
  text-align: center;
}
.homepage p {
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--secondary-color);
  text-align: center;
  padding: 5rem;
}

@media screen and (max-width: 768px) {
  .homepage h1 {
    font-size: 1.5rem;
  }
  .homepage p {
    font-size: 1rem;
    padding: 2rem;
  }
}
</style>
