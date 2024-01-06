<template>
  <DefaultLayout>
    <div class="author-form-container">
      <el-card shadow="always" class="author-form-card">
        <el-row>
          <el-text size="large" tag="b" type="primary">Create new author</el-text>
        </el-row>
        <el-divider border-style="none"></el-divider>
        <el-form
          ref="authorForm"
          :model="authorData"
          :rules="authorRules"
          label-position="top"
          class="author-form"
        >
          <el-form-item prop="name" label="Author Name" label-width="150px">
            <el-input
              v-model="authorData.name"
              prefix-icon="User"
              placeholder="Author Name"
              size="large"
            ></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :xs="24" :md="12">
              <el-form-item prop="birthDate" label="Birth Date" label-width="150px">
                <el-date-picker
                  v-model="authorData.birthDate"
                  type="year"
                  placeholder="Pick a year"
                  size="large"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item prop="nationality" label="Nationality" label-width="150px">
                <nationalities-dropdown
                  @selected-nationality="
                    (selectedNationality) => (authorData.nationality = selectedNationality)
                  "
                /> </el-form-item
            ></el-col>
          </el-row>

          <el-divider border-style="none"></el-divider>

          <el-row justify="center">
            <el-form-item>
              <el-button
                type="primary"
                class="create-button"
                @click="createAuthor"
                size="large"
                round
                >Create Author</el-button
              >
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue'
import DefaultLayout from '../components/default_layout.vue'
import { ElMessage } from 'element-plus'
import { getFirebaseIdToken } from '../components/utils/authUtils.js'
import axios from 'axios'
import NationalitiesDropdown from '../components/nationalities_dropdown.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const authorData = ref({
  name: '',
  birthDate: '',
  nationality: ''
})

const authorForm = ref(null)

const authorRules = {
  name: [{ required: true, message: 'Please enter the author name', trigger: 'blur' }],
  birthDate: [
    { required: true, message: 'Please enter the birth date', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const currentDate = new Date()
        const birthDate = new Date(value)
        const age = currentDate.getFullYear() - birthDate.getFullYear()

        if (age < 5) {
          callback(new Error('Author must be at least 5 years old.'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const createAuthor = async () => {
  console.log('authorData: ', authorData.value)
  authorForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const idToken = await getFirebaseIdToken()
        if (idToken === null) return

        const response = await axios.post('http://localhost:3000/create-author', authorData.value, {
          headers: {
            Authorization: idToken
          }
        })

        if (response.status === 200) {
          ElMessage({
            message: 'Author created successfully.',
            type: 'success'
          })
          router.push('/authors')
        } else {
          console.error('Error creating author: ', response.data)
          ElMessage({
            type: 'error',
            message: 'Error creating the author.'
          })
        }
      } catch (error) {
        console.error('Error creating author: ', error)
        ElMessage({
          type: 'error',
          message: 'Error creating the author.'
        })
      }
    }
  })
}
</script>

<style scoped>
.author-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.author-form-container .author-form-card {
  width: 60vw;
  padding: 3rem;
}

@media screen and (max-width: 768px) {
  .author-form-container .author-form-card {
    width: 90vw;
    padding: 1rem;
  }
}
</style>
