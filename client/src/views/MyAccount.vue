<template>
  <DefaultLayout>
    <div class="container">
      <div class="page-title">
        <h1>My Account</h1>
        <p>Edit personal account data</p>
      </div>

      <profile-picture v-if="!disabledRef"></profile-picture>

      <el-form
        ref="accountForm"
        :model="newLoginData"
        :rules="accountRules"
        label-position="left"
        :disabled="disabledRef"
      >
        <el-form-item prop="email" label="Email" label-width="150px">
          <el-input
            v-model="newLoginData.email"
            prefix-icon="message"
            placeholder="Email"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password" label-width="150px">
          <el-input
            type="password"
            v-model="newLoginData.password"
            prefix-icon="lock"
            placeholder="Password"
            size="large"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="Confirm Password" label-width="150px">
          <el-input
            type="password"
            v-model="newLoginData.checkPassword"
            prefix-icon="lock"
            placeholder="Confirm Password"
            size="large"
            show-password
          ></el-input>
        </el-form-item>

        <el-row justify="center">
          <el-form-item>
            <el-button type="primary" class="login-button" @click="editAccount" size="large" plain
              >Edit account</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../components/default_layout.vue'
import { getAuth, onAuthStateChanged, updateEmail, updatePassword } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import ProfilePicture from '../components/profile_picture.vue'

const router = useRouter()

const disabledRef = ref(true)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      disabledRef.value = false
    } else {
      disabledRef.value = true
    }
  })
})

const newLoginData = ref({
  email: '',
  password: '',
  checkPassword: ''
})

const accountForm = ref(null)

const validatePasswordConfirmation = (rule, value, callback) => {
  if (value === newLoginData.value.password) {
    callback()
  } else {
    callback(new Error('Passwords do not match'))
  }
}

const accountRules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please enter a valid email address',
      trigger: 'blur'
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

const auth = getAuth()
const user = auth.currentUser

onAuthStateChanged(auth, (user) => {
  if (user) {
    newLoginData.value.email = user.email
  } else {
    ElMessageBox.alert('You are not logged in.', 'Error', {
      type: 'error',
      confirmButtonText: 'Log in',
      callback: async (action) => {
        if (action === 'confirm') {
          router.push('/login')
        }
      }
    })
  }
})

const editAccount = async () => {
  accountForm.value.validate(async (valid) => {
    let email = newLoginData.value.email
    let password = newLoginData.value.password
    if (valid) {
      try {
        if (email !== user.email) {
          await updateEmail(user, newLoginData.value.email)
        }
        if (password) {
          await updatePassword(user, newLoginData.value.password)
        }

        ElMessageBox.alert('Account information updated successfully.', 'Success', {
          type: 'success',
          confirmButtonText: 'OK'
        })
      } catch (error) {
        console.error(error)
        ElMessageBox.alert('Failed to update account information.', 'Error', {
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    }
  })
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: auto;
  text-align: center;
  padding: 1rem;
}

.page-title {
  margin: 30px 0px;
}

.page-title h1 {
  font-size: 50px;
  margin: 0;
}

.page-title p {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 4px;
  line-height: 3em;
}
</style>
