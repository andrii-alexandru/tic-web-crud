<template>
  <default_layout>
    <div class="login-container">
      <el-card shadow="always" class="login-card">
        <app_logo></app_logo>
        <h2 class="title">Register</h2>
        <el-form
          ref="registerForm"
          :model="registerData"
          :rules="registerRules"
          label-position="left"
        >
          <el-form-item prop="email" label="Email" label-width="150px">
            <el-input
              v-model="registerData.email"
              prefix-icon="message"
              placeholder="Email"
              size="large"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="Password" label-width="150px">
            <el-input
              type="password"
              v-model="registerData.password"
              prefix-icon="lock"
              placeholder="Password"
              size="large"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPassword" label="Confirm Password" label-width="150px">
            <el-input
              type="password"
              v-model="registerData.checkPassword"
              prefix-icon="lock"
              placeholder="Confirm Password"
              size="large"
              show-password
            ></el-input>
          </el-form-item>

          <el-row justify="center">
            <el-form-item>
              <el-button
                type="primary"
                class="login-button"
                @click="registerUser"
                size="large"
                round
                >Register</el-button
              >
            </el-form-item>
          </el-row>
        </el-form>

        <el-row justify="end">
          <RouterLink to="/login">
            <el-link type="primary">Login</el-link>
          </RouterLink>
        </el-row>
      </el-card>
    </div>
  </default_layout>
</template>

<script setup>
import app_logo from '../components/app_logo.vue'
import default_layout from '../components/default_layout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/components/utils/authUtils'

const router = useRouter()

const registerData = ref({
  email: '',
  password: '',
  checkPassword: ''
})

const registerForm = ref(null)

const validatePasswordConfirmation = (rule, value, callback) => {
  if (value === registerData.value.password) {
    callback()
  } else {
    callback(new Error('Passwords do not match'))
  }
}

const registerRules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please enter a valid email address',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password length should be at least 6 characters', trigger: 'blur' }
  ],
  checkPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    { validator: validatePasswordConfirmation, trigger: 'blur' }
  ]
}

const registerUser = () => {
  registerForm.value.validate(async (valid) => {
    let email = registerData.value.email
    let password = registerData.value.password
    if (valid) {
      const success = register(email, password)
      if (success) await router.push('/my-account')
    }
  })
}
</script>
