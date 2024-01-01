<template>
  <default-layout>
    <div class="login-container">
      <el-card
        shadow="always"
        class="login-card"
        :body-style="{ padding: '40px' }"
        v-loading="loading"
      >
        <app-logo></app-logo>
        <br />
        <el-row justify="center">
          <el-text type="danger" size="large" tag="b">Forgot password</el-text>
        </el-row>
        <br />

        <el-form
          ref="forgotPasswordForm"
          :model="forgotPasswordData"
          :rules="forgotPasswordRules"
          label-position="left"
          @submit.prevent="sendResetEmail"
        >
          <el-form-item prop="email" label="Email" label-width="150px">
            <el-input
              v-model="forgotPasswordData.email"
              prefix-icon="User"
              placeholder="Email"
              size="large"
            ></el-input>
          </el-form-item>

          <el-row justify="center">
            <el-form-item>
              <el-button native-type="submit" type="danger" size="large" round
                >Send reset email</el-button
              >
            </el-form-item>
          </el-row>
        </el-form>

        <el-row justify="end">
          <router-link to="/login">
            <el-link type="primary">Back to Login</el-link>
          </router-link>
        </el-row>
      </el-card>
    </div>
  </default-layout>
</template>

<script setup>
import DefaultLayout from '@/components/default_layout.vue'
import AppLogo from '@/components/app_logo.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus' // Import Element Plus message component
import { sendPasswordResetEmail, getAuth } from 'firebase/auth' // Import sendPasswordResetEmail from firebase/auth

const loading = ref(false)
const forgotPasswordForm = ref(null)

const forgotPasswordData = ref({
  email: ''
})

const forgotPasswordRules = ref({
  email: [
    { required: true, message: 'Please input your email', trigger: 'blur' },
    { type: 'email', message: 'Please input a valid email', trigger: 'blur' }
  ]
})

const sendResetEmail = async () => {
  await forgotPasswordForm.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    const auth = getAuth()
    const email = forgotPasswordData.value.email

    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'http://localhost:5173/login'
      })
      ElMessage.success('Password reset email sent successfully')
    } catch (error) {
      console.error(error)
      ElMessage.error('Failed to send reset email. Please check your email address.')
    }

    loading.value = false
  })
}
</script>
