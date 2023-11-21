<template>
  <DefaultLayout>
    <div class="login-container main-container-pattern">
      <el-card shadow="hover" class="login-card" :body-style="{ padding: '40px' }">
        <AppLogo></AppLogo>

        <h2 class="title">Sign In</h2>

        <el-form ref="loginForm" :model="loginData" :rules="loginRules" label-position="left">
          <el-form-item prop="username" label="Username" label-width="150px">
            <el-input
              v-model="loginData.username"
              prefix-icon="User"
              placeholder="Username"
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
            <el-link type="danger" :icon="Edit">Forgot Password?</el-link>
          </RouterLink>
          <RouterLink to="/register">
            <el-link type="primary">Register</el-link>
          </RouterLink>
        </el-row>
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue'
import DefaultLayout from '../components/DefaultLayout.vue'
import AppLogo from '../components/AppLogo.vue'
import { ElMessage } from 'element-plus'

const loginData = ref({
  username: '',
  password: ''
})

const loginForm = ref(null)

const loginRules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }]
}

const login = () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      ElMessage({
        message: 'Congrats, this is a success message.',
        type: 'success'
      })
    }
  })
}
</script>
