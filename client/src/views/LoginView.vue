<template>
  <DefaultLayout>
    <div class="login-container">
      <el-card shadow="always" class="login-card" :body-style="{ padding: '40px' }">
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
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue'
import DefaultLayout from '../components/default_layout.vue'
import app_logo from '../components/app_logo.vue'
import { ElMessage } from 'element-plus'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginData = ref({
  email: '',
  password: ''
})

const loginForm = ref(null)

const loginRules = {
  email: [{ required: true, message: 'Please enter your email', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }]
}

const login = () => {
  loginForm.value.validate(async (valid) => {
    let email = loginData.value.email
    let password = loginData.value.password
    if (valid) {
      const auth = getAuth()
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Signed in
          // const user = userCredential.user;
          ElMessage({
            message: 'Congrats, you logged in.',
            type: 'success'
          })
          router.push('/my-account')
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
