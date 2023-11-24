<template>
  <DefaultLayout>
    <div class="container">
      <div class="page-title">
        <h1>
          My Account
        </h1>
        <p>edit personal account data</p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../components/DefaultLayout.vue'
import { getAuth } from "firebase/auth";
import { ref, onMounted, resolveDirective } from 'vue';
import { ElMessageBox } from "element-plus";
import { useRouter } from 'vue-router'


const auth = getAuth();
const user = auth.currentUser;
const router = useRouter()

if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
  console.log(user);
} else {
  ElMessageBox.alert('You are not logged in.', 'Error', {
    type: 'error',
    confirmButtonText: 'Log in',
    callback: async (action) => {
      if (action === 'confirm') {
        router.push('/login')
      }
    },
  });
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: auto;
  text-align: center;
}

.page-title {
  margin: 70px 0px;
}

.page-title h1 {
  font-size: 50px;
}

.page-title p {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 4px;
  line-height: 3em;
  color: rgba(0, 0, 0, 0.4);
}
</style>
