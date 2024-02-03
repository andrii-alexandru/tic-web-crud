<template>
  <default-layout>
    <div class="login-container">
      <el-card
        shadow="always"
        class="login-card"
        :body-style="{ padding: '1 rem', 'max-width': '400px', margin: '0 auto' }"
      >
        <app-logo></app-logo>

        <el-form ref="loginForm" :model="loginData" :rules="loginRules" label-position="top">
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
              <el-button type="primary" @click="login" size="large" round>Login</el-button>
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
  </default-layout>
</template>

<script setup>
import { ref } from 'vue'
import DefaultLayout from '@/components/default_layout.vue'
import AppLogo from '@/components/app_logo.vue'
import { signIn } from '@/components/utils/authUtils'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const loginForm = ref(null)
const router = useRouter()
const store = useStore()

const loginData = ref({
  email: '',
  password: ''
})

const loginRules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }]
}

const login = async () => {
  store.commit('setLoading', true)

  await loginForm.value.validate(async (valid) => {
    if (valid) {
      const success = await signIn(loginData.value.email, loginData.value.password)
      if (success) router.push('/')
    }
  })

  store.commit('setLoading', false)
}
</script>
