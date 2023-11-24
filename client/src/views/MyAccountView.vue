<template>
  <DefaultLayout>
    <div class="container">
      <div class="page-title">
        <h1>
          My Account
        </h1>
        <p>Edit personal account data</p>
      </div>
      <div class="user-info">
        <p v-if="user">Email: {{ user.email }}</p>
      </div>

      <el-form ref="loginForm" :model="loginData" :rules="loginRules" label-position="left">
        <el-form-item prop="email" label="Email" rules="email" label-width="150px">
          <el-input v-model="loginData.email" prefix-icon="message" placeholder="Email" size="large"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password" rules="required|password" label-width="150px">
          <el-input type="password" v-model="loginData.password" prefix-icon="lock" placeholder="Password" size="large"
            show-password></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="Confirm Password" rules="required|confirmed:password"
          label-width="150px">
          <el-input type="password" v-model="loginData.checkPassword" prefix-icon="lock" placeholder="Confirm Password"
            size="large" show-password></el-input>
        </el-form-item>

        <el-row justify="center">
          <el-form-item>
            <el-button type="primary" class="login-button" @click="editAccount" size="large">Edit account</el-button>
          </el-form-item>
        </el-row>
      </el-form>

    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../components/default_layout.vue'
import { getAuth, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { ref, onMounted } from 'vue';
import { ElMessageBox } from "element-plus";
import { useRouter } from 'vue-router'

const router = useRouter();

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

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    loginData.value.email = user.email;
  } else {
    ElMessageBox.alert('You are not logged in.', 'Error', {
      type: 'error',
      confirmButtonText: 'Log in',
      callback: async (action) => {
        if (action === 'confirm') {
          router.push('/login');
        }
      },
    });
  }
});

const editAccount = async () => {
  loginForm.value.validate(async (valid) => {
    let email = loginData.value.email
    let password = loginData.value.password
    if (valid) {
      try {
        if (email !== user.email) {
          await updateEmail(user, newEmail.value);
        }
        if (password) {
          await updatePassword(user, newPassword.value);
        }

        ElMessageBox.alert('Account information updated successfully.', 'Success', {
          type: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error(error);
        ElMessageBox.alert('Failed to update account information.', 'Error', {
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  })
};
</script>


<style scoped>
.container {
  max-width: 1400px;
  margin: auto;
  text-align: center;
  padding: 1rem;
}

.page-title {
  margin: 70px 0px;
}

.page-title h1 {
  font-size: 50px;
}

.page-title p {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 4px;
  line-height: 3em;
}
</style>
