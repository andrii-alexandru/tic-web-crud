<template>
  <div>
    <el-button link type="primary" size="small" @click="dialogVisible = true">Edit</el-button>

    <el-dialog
      title="Edit Author"
      v-model="dialogVisible"
      width="80vw"
      style="z-index: 100 !important"
      :append-to-body="true"
    >
      <el-form :model="authorData" :rules="authorRules" ref="authorForm" label-position="top">
        <el-form-item prop="name" label="Author Name" class="form-item">
          <el-input v-model="authorData.name" placeholder="Enter author name"></el-input>
        </el-form-item>
        <el-form-item prop="birthDate" label="Birth Date" class="form-item">
          <el-date-picker v-model="authorData.birthDate" type="year" placeholder="Pick a year" />
        </el-form-item>
        <el-form-item prop="nationality" label="Nationality" class="form-item">
          <nationalities-dropdown
            :nationality="authorData.nationality"
            @selected-nationality="
              (selectedNationality) => (authorData.nationality = selectedNationality)
            "
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editQuote">Edit</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getFirebaseIdToken } from '../components/utils/authUtils.js'
import axios from 'axios'
import NationalitiesDropdown from '../components/NationalitiesDropdown.vue'

const authorProp = defineProps({
  author: Object
})

const emit = defineEmits(['authorEdited'])

const authorForm = ref(null)

const authorData = ref({
  id: '',
  author: '',
  body: '',
  bookReference: '',
  significant: false
})

const authorRules = {
  author: [{ required: true, message: 'Please select the author', trigger: 'blur' }],
  body: [{ required: true, message: 'Please enter the quote body', trigger: 'blur' }]
}

const dialogVisible = ref(false)
const editQuote = async () => {
  authorForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const idToken = await getFirebaseIdToken()
        if (idToken === null) return

        const response = await axios.put(
          `http://localhost:3000/edit-author/${authorData.value.id}`,
          authorData.value,
          {
            headers: {
              Authorization: idToken
            }
          }
        )
        if (response.status === 200) {
          ElMessage({
            message: 'Quote created successfully.',
            type: 'success'
          })
          emit('authorEdited')
          dialogVisible.value = false
        } else {
          console.error('Error creating quote: ', response.data)
          ElMessage({
            type: 'error',
            message: 'Error creating the quote.'
          })
        }
      } catch (error) {
        console.error('Error editing quote: ', error)
      }
    } else {
      return false
    }
  })
}

onMounted(() => {
  authorData.value = authorProp.author
})
</script>
