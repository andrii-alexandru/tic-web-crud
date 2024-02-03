<template>
  <div>
    <el-button @click="showAddAuthorForm" circle>
      <el-icon>
        <Plus />
      </el-icon>
    </el-button>

    <el-dialog title="Add New Author" v-model="dialogVisible" @close="resetForm" :append-to-body="true" width="80vw">
      <el-form :model="authorData" :rules="newAuthorRules" ref="authorForm" label-position="top">
        <el-form-item prop="name" label="Author Name" class="form-item">
          <el-input v-model="authorData.name" placeholder="Enter author name" size="large"></el-input>
        </el-form-item>
        <el-form-item prop="birthDate" label="Birth Date" class="form-item">
          <el-date-picker v-model="authorData.birthDate" type="year" placeholder="Pick a year" style="width: 100%"
            size="large" />
        </el-form-item>
        <el-form-item prop="nationality" label="Country of origin" class="form-item">
          <!-- <el-input v-model="authorData.nationality" placeholder="Enter nationality"></el-input> -->
          <nationalities-dropdown @selected-nationality="(selectedNationality) => (authorData.nationality = selectedNationality)
            " />
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="addNewAuthor" size="large">Add Author</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import NationalitiesDropdown from '../components/nationalities_dropdown.vue'
import { getFirebaseIdToken } from '../components/utils/authUtils.js'
import axios from 'axios'

const emit = defineEmits(['authorAdded'])

const dialogVisible = ref(false)

const authorForm = ref(null)
const authorData = ref({
  name: '',
  birthDate: '',
  nationality: ''
})

// Rules for the form to add a new author
const newAuthorRules = {
  name: [{ required: true, message: 'Please enter the author name', trigger: 'blur' }],
  birthDate: [
    { required: true, message: 'Please enter the birth date', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          // If birth date is not provided, no further validation needed
          callback()
        } else {
          const birthDate = new Date(value)
          const currentDate = new Date()
          const age = currentDate.getFullYear() - birthDate.getFullYear()

          if (age < 5) {
            // Validation fails if age is less than 5 years
            callback(new Error('Author must be at least 5 years old.'))
          } else {
            // Validation succeeds
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ],
  nationality: [{ required: true, message: 'Please enter the nationality', trigger: 'blur' }]
}

// Show dialog for adding a new author
const showAddAuthorForm = () => {
  dialogVisible.value = true
}

// Add a new author to the Firestore collection
const addNewAuthor = async () => {
  authorForm.value.validate(async (valid) => {
    if (!valid) return

    try {
      const idToken = await getFirebaseIdToken()
      if (idToken === null) return

      const response = await axios.post(
        'http://localhost:3000/api/create-author',
        authorData.value,
        {
          headers: {
            Authorization: idToken
          }
        }
      )

      if (response.status !== 200) throw new Error(response.data)

      ElMessage({
        message: 'Author created successfully.',
        type: 'success'
      })
      dialogVisible.value = false
      emit('authorAdded')
    } catch (error) {
      console.error('Error adding author: ', error)
      ElMessage({
        type: 'error',
        message: 'Error adding the author.'
      })
    }
  })
}

// Reset the form when the dialog is closed
const resetForm = () => {
  authorData.value = {
    name: '',
    birthDate: '',
    nationality: ''
  }
}
</script>

<style scoped>
.form-item {
  padding: 1rem;
}
</style>
