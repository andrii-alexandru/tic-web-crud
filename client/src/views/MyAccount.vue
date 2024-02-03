<template>
  <DefaultLayout>
    <div class="container">
      <div class="page-title">
        <h1>My Account</h1>
      </div>

      <profile-picture v-if="!disabledRef"></profile-picture>

      <br>
      <br>

      <el-link v-if="disabledRef" type="primary" href="/login">
        go to login &nbsp; <el-icon>
          <Right />
        </el-icon>
      </el-link>

      <el-form ref="accountForm" :model="changePasswordData" :rules="accountRules" label-position="top"
        :disabled="disabledRef" class="mt-5">
        <el-form-item prop="email" label="Email" label-width="150px">
          <el-input v-model="userEmail" prefix-icon="message" placeholder="Email" size="large"
            disabled></el-input>
        </el-form-item>
        
        <br/>
        <el-text size="large" tag="b">CHANGE PASSWORD SECTION</el-text>
        
        <el-form-item prop="oldPassword" label="Old Password" label-width="150px">
          <el-input type="password" v-model="changePasswordData.oldPassword" prefix-icon="lock" placeholder="Old Password"
            size="large" show-password></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password" label-width="150px">
          <el-input type="password" v-model="changePasswordData.password" prefix-icon="lock" placeholder="Password"
            size="large" show-password></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="Confirm Password" label-width="150px">
          <el-input type="password" v-model="changePasswordData.checkPassword" prefix-icon="lock"
            placeholder="Confirm Password" size="large" show-password></el-input>
        </el-form-item>

        <el-row justify="center">
          <el-form-item>
            <el-button type="info" class="login-button" @click="editAccount" size="large">change password</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../components/default_layout.vue'
import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import ProfilePicture from '../components/profile_picture.vue'
import { useStore } from 'vuex'

const disabledRef = ref(true)
const changePasswordData = ref({
  oldPassword: '',
  password: '',
  checkPassword: ''
})
const userEmail = ref('')
const accountForm = ref(null)
const store = useStore()

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userEmail.value = user.email
      disabledRef.value = false
    } else {
      disabledRef.value = true
    }
  })
})

const validatePasswordConfirmation = (rule, value, callback) => {
  if (value === changePasswordData.value.password) {
    callback()
  } else {
    callback(new Error('Passwords do not match'))
  }
}

const accountRules = {
  oldPassword: [
    { required: true, message: 'Please enter your old password', trigger: 'blur' },
    { min: 6, message: 'Password length should be at least 6 characters', trigger: 'blur' }
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

const editAccount = async () => {
  accountForm.value.validate(async (valid) => {
    let password = changePasswordData.value.password ?? null

    var user = getAuth().currentUser
    var credentials = EmailAuthProvider.credential(
      userEmail.value,
      changePasswordData.value.oldPassword
    )

    if (!valid) return

    store.commit('setLoading', true)

    try {
      await reauthenticateWithCredential(user, credentials)
    } catch (error) {
      ElMessageBox.alert('Could not reauthenticate! ' + error.message, 'Error', {
        type: 'error',
        confirmButtonText: '😢'
      })
      return
    }
    finally {
      store.commit('setLoading', false)
    }

    try {
      if (!password || password === changePasswordData.value.oldPassword) {
        ElMessageBox.alert('Password not updated. The old and new passwords are the same!', 'Info', {
          type: 'info',
          confirmButtonText: 'OK'
        })
        return
      }

      await updatePassword(user, changePasswordData.value.password)

      accountForm.value.resetFields()

      ElMessageBox.alert('Password updated succesfully.', 'Success', {
        type: 'success',
        confirmButtonText: 'OK'
      })

    } catch (error) {
      ElMessageBox.alert('Failed to update account information. ' + error.message, 'Error', {
        type: 'error',
        confirmButtonText: '😢'
      })
    }
    finally {
      store.commit('setLoading', false)
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
