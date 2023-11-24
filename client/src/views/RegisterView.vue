<template>
  <DefaultLayout>
    <div class="login-container main-container-pattern">
      <el-card shadow="hover" class="login-card">
        <AppLogo></AppLogo>
        <h2 class="title">Register</h2>
        <el-form ref="loginForm" :model="loginData" :rules="loginRules" label-position="left">
          <el-form-item prop="email" label="Email" rules="email" label-width="150px">
            <el-input
              v-model="loginData.email"
              prefix-icon="message"
              placeholder="Email"
              size="large"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            label="Password"
            rules="required|password"
            label-width="150px"
          >
            <el-input
              type="password"
              v-model="loginData.password"
              prefix-icon="lock"
              placeholder="Password"
              size="large"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="checkPassword"
            label="Confirm Password"
            rules="required|confirmed:password"
            label-width="150px"
          >
            <el-input
              type="password"
              v-model="loginData.checkPassword"
              prefix-icon="lock"
              placeholder="Confirm Password"
              size="large"
              show-password
            ></el-input>
          </el-form-item>

          <el-row justify="center">
            <el-form-item>
              <el-button type="primary" class="login-button" @click="register" size="large"
                >Register</el-button
              >
              <el-button class="login-button" @click="register" size="large" round plain>
                <img src="../assets/images/google.svg" alt="google logo" class="svg_google_image" />
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>

        <el-row justify="space-between">
          <RouterLink to="/forgot-password">
            <el-link type="danger" :icon="Edit">Forgot Password?</el-link>
          </RouterLink>
          <RouterLink to="/login">
            <el-link type="primary">Login</el-link>
          </RouterLink>
        </el-row>
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import AppLogo from '../components/AppLogo.vue'
import DefaultLayout from '../components/DefaultLayout.vue'
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginData = ref({
  email: '',
  password: '',
  checkPassword: ''
})

const loginForm = ref(null)

const validatePasswordConfirmation = (rule, value, callback) => {
  if (value === loginData.value.password) {
    callback()
  } else {
    callback(new Error('Passwords do not match'))
  }
}

const loginRules = {
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

const register = () => {
  loginForm.value.validate(async (valid) => {
    let email = loginData.value.email
    let password = loginData.value.password
    if (valid) {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          ElMessage({
            type: 'success',
            message: 'Registration succesful!'
          })
          router.push('/homepage')
        })
        .catch((error) => {
          ElMessage({
            type: 'error',
            message: error.message
          })
        })
    }
  })
}
</script>

<style scoped>
.svg_google_image {
  height: 20px;
}
</style>
