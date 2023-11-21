<template>
  <DefaultLayout>
    <transition appear name="el-fade-in-linear">
      <div class="login-container main-container-pattern">
        <el-card shadow="hover" class="login-card" :body-style="{ padding: '40px' }">
          <div class="login-logo">
            <svg
              width="169"
              height="40"
              viewBox="0 0 169 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0148 2.5V40H0V2.5H10.0148Z"
                fill="#409EFF"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.0222 2.5H36.3037C43.2175 2.5 48.8222 8.09644 48.8222 15C48.8222 21.9036 43.2175 27.5 36.3037 27.5H25.037V40H15.0222V2.5ZM25.037 17.5H36.3037C37.6865 17.5 38.8074 16.3807 38.8074 15C38.8074 13.6193 37.6865 12.5 36.3037 12.5H25.037V17.5Z"
                fill="#409EFF"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M86.3778 2.5V21.875C86.3778 26.3623 90.0208 30 94.5148 30C99.0088 30 102.652 26.3623 102.652 21.875V2.5H112.667V21.875C112.667 31.8852 104.54 40 94.5148 40C84.4898 40 76.363 31.8852 76.363 21.875V2.5H86.3778Z"
                fill="#409EFF"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M52.5778 20C52.5778 10.335 60.4244 2.5 70.1037 2.5H72.6074V12.5H70.1037C65.9554 12.5 62.5926 15.8579 62.5926 20V21.25C62.5926 31.6053 54.1855 40 43.8148 40H42.563V30H43.8148C48.6545 30 52.5778 26.0825 52.5778 21.25V20Z"
                fill="#409EFF"
              ></path>
              <path
                d="M169 3.75C169 5.82107 167.319 7.5 165.244 7.5C163.17 7.5 161.489 5.82107 161.489 3.75C161.489 1.67893 163.17 0 165.244 0C167.319 0 169 1.67893 169 3.75Z"
                fill="#409EFF"
              ></path>
              <path
                d="M123.42 40L128.199 20.0181L131.752 32.0393C133.87 39.2091 144.041 39.2091 146.16 32.0393L149.712 20.0181L154.491 40H164.787L157.273 8.57949C155.486 1.10744 144.941 0.830781 142.763 8.19891L138.956 21.0833L135.148 8.19892C132.971 0.830824 122.425 1.1074 120.638 8.57948L113.124 40H123.42Z"
                fill="#409EFF"
              ></path>
            </svg>
          </div>

          <h2 class="title">Sign In</h2>

          <el-form :model="loginForm" :rules="loginRules">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                prefix-icon="User"
                placeholder="Username"
                size="large"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="loginForm.password"
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
            <RouterLink to="/sign-up">
              <el-link type="primary">Sign Up</el-link>
            </RouterLink>
          </el-row>
        </el-card>
      </div>
    </transition>
  </DefaultLayout>
</template>

<script>
import { reactive, ref } from 'vue'

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = ref({
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }]
})

const login = () => {
  // Implement your login logic here
  console.log('Login button clicked')
}
</script>

<style scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0px;
  color: var(--el-color-primary-light-3);
  text-transform: uppercase;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-card {
  width: 400px;
  text-align: center;
}
.main-container-pattern {
  width: 100%;
  height: 100%;
  background: repeating-radial-gradient(
    circle at 50%,
    rgb(26, 133, 233),
    rgb(104, 183, 230) 1em,
    white 1em,
    white 2em
  );
}

.dark .main-container-pattern {
  width: 100%;
  height: 100%;
  background: repeating-radial-gradient(
    circle at 50%,
    black,
    black 1em,
    rgb(26, 133, 233) 1em,
    rgb(26, 133, 233) 2em
  );
}
</style>
