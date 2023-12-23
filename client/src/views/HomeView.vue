<script setup>
import DefaultLayout from '../components/default_layout.vue'
import app_logo from '../components/app_logo.vue'
</script>

<template>
  <DefaultLayout>
    <div class="homepage">
      <app_logo></app_logo>
      <h1>Welcome to our Quotes CRUD App!</h1>
      <p>
        "Explore the wisdom of words as you journey through a collection of inspiring and
        thought-provoking quotes. Immerse yourself in the power of language, where every quote tells
        a unique story and imparts a valuable lesson. Whether you seek motivation, reflection, or
        simply a moment of inspiration, our app is your gateway to a world of profound insights.
        Enjoy the seamless experience of creating, reading, updating, and deleting quotes
        effortlessly. Let the words resonate and uplift your spirits. Dive into the realm of
        timeless wisdom with our Quotes CRUD App – where words come to life."
      </p>
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
}
.homepage p {
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--secondary-color);
  text-align: center;
  padding: 5rem;
}
</style>
