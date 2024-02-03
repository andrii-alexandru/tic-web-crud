<template>
  <el-container class="layout-container-demo">
    <el-drawer v-model="aside_visible" :show-close="true" direction="ltr" size="auto">
      <template #header>
        <div>
          <el-tooltip content="This action will log you out!" show-arrow>
            <el-button v-if="userRef" type="danger" circle plain @click="logout">
              <el-icon>
                <SwitchButton />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </template>
      <el-aside width="50vw">
        <el-scrollbar>
          <el-menu :default-openeds="['2']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <User /> </el-icon
                >User
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="redirectTo('/my-account')">
                  My Account
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="1-3" @click="redirectTo('/favorites')">
                  Favorites
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <Collection /> </el-icon
                >Authors & Quotes
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1" @click="redirectTo('/authors')"> Authors </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="2-3" @click="redirectTo('/quotes')"> Quotes </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <CirclePlus /> </el-icon
                >Faker data
              </template>
              <el-menu-item-group>
                <template #title>Generate faker data (10 each)</template>
                <el-menu-item index="3-1" @click="generateRandomAuthors">
                  Generate Random Authors
                </el-menu-item>
                <el-menu-item index="3-2" @click="generateRandomQuotes">
                  Generate Random Quotes
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
    </el-drawer>

    <el-header>
      <el-row justify="space-between" align="middle" style="height: 100%">
        <el-button
          type="primary"
          plain
          style="margin-left: 16px"
          @click="aside_visible = true"
          round
        >
          <el-icon>
            <Expand />
          </el-icon>
        </el-button>
        <el-button
          link
          v-if="!userRef"
          @click="redirectTo('/login')"
          type="primary"
          class="hidden-md-and-down"
          >Login</el-button
        >
        <el-text type="info" class="hidden-md-and-down" v-else
          >Welcome, {{ userRef.email }}</el-text
        >
        <Thememodeswitch />
      </el-row>
    </el-header>

    <el-main class="mt-20" v-loading="loading">
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Thememodeswitch from './theme_mode_switch.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { useStore } from 'vuex'
import { getFirebaseIdToken, signOutUser } from '@/components/utils/authUtils'

const router = useRouter()
const auth = getAuth()
const userRef = ref(null)
const store = useStore()

const loading = computed(() => store.getters['isLoading'])

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    userRef.value = user
  })
})

const aside_visible = ref(false)

const logout = async function () {
  if (signOutUser()) redirectTo('/login')
}

const redirectTo = function (path) {
  if (path === router.currentRoute.value.path) aside_visible.value = false
  router.push(path)
}

const generateRandomAuthors = function () {
  ElMessageBox.confirm('This will generate 10 random authors. Continue?', 'Faker Data - Authors', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      const idToken = await getFirebaseIdToken()
      if (idToken === null) return

      const response = await axios.post('http://localhost:3000/api/generate-random-authors', null, {
        headers: {
          Authorization: idToken
        }
      })

      if (response.status === 200) {
        ElMessage({
          type: 'success',
          message: 'Generate authors completed'
        })
      } else {
        console.error('Error generating authors: ', response.data)
        ElMessage({
          type: 'error',
          message: 'Error generating the authors.'
        })
      }

      router.push('/authors')
    })
    .catch((e) => {
      console.error(e)
      ElMessage({
        type: 'info',
        message: 'There was an error generating the authors.'
      })
    })
}

const generateRandomQuotes = function () {
  ElMessageBox.confirm('This will generate 10 random quotes. Continue?', 'Faker Data - Quotes', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      const idToken = await getFirebaseIdToken()
      if (idToken === null) return

      const response = await axios.post('http://localhost:3000/api/generate-random-quotes', null, {
        headers: {
          Authorization: idToken
        }
      })

      if (response.status === 200) {
        ElMessage({
          type: 'success',
          message: 'Generate quotes completed'
        })
        router.push('/quotes')
      } else {
        console.error('Error generating quotes: ', response.data)
        ElMessage({
          type: 'error',
          message: 'Error generating the quotes.'
        })
      }
    })
    .catch((e) => {
      console.error(e)
      ElMessage({
        type: 'info',
        message: 'There was an error generating the quotes.'
      })
    })
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-7);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.el-aside {
  background-color: transparent !important;
}
</style>
