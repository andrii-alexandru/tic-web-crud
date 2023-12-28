<template>
  <default_layout>
    <div class="login-container">
      <el-card
        shadow="always"
        class="login-card"
        :body-style="{ padding: '40px' }"
        v-loading="loading"
      >
        <app_logo></app_logo>

        <h2 class="title">Sign In</h2>

        <el-form
          ref="loginForm"
          :model="loginData"
          :rules="loginRules"
          label-position="left"
          @keyup.enter="login"
        >
          <el-form-item prop="email" label="Email" label-width="150px">
            <el-input
              v-model="loginData.email"
              prefix-icon="User"
              placeholder="Email"
              size="large"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="Password" label-width="150px">
            <el-input
              type="password"
              v-model="loginData.password"
              prefix-icon="Lock"
              placeholder="Password"
              size="large"
              show-password
            ></el-input>
          </el-form-item>

          <el-row justify="center">
            <el-form-item>
              <el-button type="primary" class="login-button" @click="login" size="large" round
                >Log In</el-button
              >
            </el-form-item>
          </el-row>
        </el-form>

        <el-row justify="space-between">
          <RouterLink to="/forgot-password">
            <el-link type="danger">Forgot Password?</el-link>
          </RouterLink>
          <RouterLink to="/register">
            <el-link type="primary">Register</el-link>
          </RouterLink>
        </el-row>
      </el-card>
    </div>
  </default_layout>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Default_layout from '@/components/default_layout.vue'
import App_logo from '@/components/app_logo.vue'

const store = useStore()
const router = useRouter()
const loading = ref(false)

const loginData = ref({
  email: '',
  password: ''
})

const loginRules = {
  email: [{ required: true, message: 'Please enter your email', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }]
}

const login = async () => {
  loading.value = true
  await store.dispatch('signIn', {
    email: loginData.value.email,
    password: loginData.value.password
  })
  loading.value = false

  const authError = store.getters.authError
  if (authError) {
    ElMessage({
      type: 'error',
      message: authError
    })
    return
  }

  ElMessage({
    showClose: true,
    message: 'Congrats, you logged in.',
    type: 'success'
  })

  await router.push('/my-account')
}
</script>
