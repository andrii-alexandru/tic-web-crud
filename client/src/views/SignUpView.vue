<template>
  <DefaultLayout>
    <div class="login-container main-container-pattern">
      <el-card shadow="hover" class="login-card" >
        <AppLogo></AppLogo>
        <h2 class="title">Sign Up</h2>
        <el-form :model="loginForm" :rules="loginRules" label-position="left">
          <el-form-item prop="username" label="Username" label-width="150px">
            <el-input v-model="loginForm.username" prefix-icon="user" placeholder="Username" size="large"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="Email" rules="email" label-width="150px">
            <el-input v-model="loginForm.email" prefix-icon="message" placeholder="Email" size="large"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="Password" rules="required|password" label-width="150px">
            <el-input type="password" v-model="loginForm.password" prefix-icon="lock" placeholder="Password" size="large"
              show-password></el-input>
          </el-form-item>
          <el-form-item prop="checkPassword" label="Confirm Password" rules="required|confirmed:password" label-width="150px">
            <el-input type="password" v-model="loginForm.checkPassword" prefix-icon="lock" placeholder="Confirm Password"
              size="large" show-password></el-input>
          </el-form-item>

          <el-row justify="center">
            <el-form-item>
              <el-button type="primary" class="login-button" @click="register(loginForm)" size="large"
                round>Register</el-button>
            </el-form-item>
          </el-row>
        </el-form>

        <el-row justify="space-between">
          <RouterLink to="/forgot-password">
            <el-link type="danger" :icon="Edit">Forgot Password?</el-link>
          </RouterLink>
          <RouterLink to="/sign-in">
            <el-link type="primary">Sign In</el-link>
          </RouterLink>
        </el-row>
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script>
import AppLogo from '../components/AppLogo.vue';
import DefaultLayout from '../components/DefaultLayout.vue';

export default {
  name: 'SignupView',
  components: {
    AppLogo,
    DefaultLayout,
  },
  data() {
    return {
      loginForm: {
        username: '',
        email: '',
        password: '',
        checkPassword: '',
      },
      loginRules: {
        username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
        email: [{ required: true, message: 'Please enter your email', trigger: 'blur' }, { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          { min: 6, message: 'Password length should be at least 6 characters', trigger: 'blur' },
        ],
        checkPassword: [
          { required: true, message: 'Please confirm your password', trigger: 'blur' },
          { validator: this.validatePasswordConfirmation, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    validatePasswordConfirmation(rule, value, callback) {
      if (value === this.loginForm.password) {
        callback();
      } else {
        callback(new Error('Passwords do not match'));
      }
    },
    register(formData) {
      // Implement your registration logic here
      console.log('Registration data:', formData);
    },
  },
};
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
  width: 800px;
  text-align: center;
  padding: 100px;
}

.main-container-pattern {
  width: 100%;
  height: 100%;
  background: repeating-radial-gradient(circle at 50%,
      rgb(26, 133, 233),
      rgb(104, 183, 230) 1em,
      white 1em,
      white 2em);
}

.dark .main-container-pattern {
  width: 100%;
  height: 100%;
  background: repeating-radial-gradient(circle at 50%,
      black,
      black 1em,
      rgb(26, 133, 233) 1em,
      rgb(26, 133, 233) 2em);
}
</style>
