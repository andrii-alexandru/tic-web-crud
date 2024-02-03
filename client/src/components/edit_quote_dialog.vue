<template>
  <div>
    <el-button link type="primary" size="small" @click="dialogVisible = true">Edit</el-button>

    <el-dialog
      @open="openDialog"
      title="Edit Quote"
      v-model="dialogVisible"
      width="80vw"
      style="z-index: 100 !important"
      :append-to-body="true"
    >
      <el-form :model="quoteData" :rules="quoteRules" ref="quoteForm" label-position="top">
        <el-form-item prop="authorId" label="Author">
          <el-select v-model="quoteData.authorId" placeholder="Select Author" size="large" disabled>
            <el-option
              v-for="author in authors"
              :key="author.id"
              :label="author.name"
              :value="author.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="body" label="Quote Body" label-width="150px">
          <el-input
            v-model="quoteData.body"
            type="textarea"
            placeholder="Enter the quote..."
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item prop="bookReference" label="Book or Reference" label-width="150px">
          <el-input
            v-model="quoteData.bookReference"
            placeholder="Book or Reference"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="Significant">
          <el-switch v-model="quoteData.significant" size="large" />
        </el-form-item>
      </el-form>

      <template v-if="quoteData.userEmail">
        <el-divider content-position="right"
          ><el-text size="small" type="primary"
            >created by
            <el-text size="small" type="primary" tag="ins">{{
              quoteData.userEmail
            }}</el-text></el-text
          ></el-divider
        >
      </template>
      <template #footer>
        <el-button @click="dialogVisible = false" size="large">Cancel</el-button>
        <el-button type="primary" @click="editQuote" size="large">Edit</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { ElMessage } from 'element-plus'
import { getFirebaseIdToken } from '../components/utils/authUtils.js'
import axios from 'axios'

const quoteProp = defineProps({
  quote: Object
})

const emit = defineEmits(['quoteEdited'])

const authors = ref([])
const quoteForm = ref(null)

const quoteData = ref({
  id: '',
  authorId: '',
  body: '',
  bookReference: '',
  significant: false,
  userEmail: ''
})

const quoteRules = {
  authorId: [{ required: true, message: 'Please select the author', trigger: 'blur' }],
  body: [{ required: true, message: 'Please enter the quote body', trigger: 'blur' }]
}

const dialogVisible = ref(false)

const fetchAuthors = async () => {
  try {
    const db = getFirestore()
    const authorsCollection = collection(db, 'authors') // Adjust to your actual collection name
    const querySnapshot = await getDocs(authorsCollection)

    authors.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching authors: ', error)
  }
}

const editQuote = async () => {
  quoteForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const idToken = await getFirebaseIdToken()
        if (idToken === null) return

        const response = await axios.put(`http://localhost:3000/api/edit-quote`, quoteData.value, {
          headers: {
            Authorization: idToken
          }
        })
        if (response.status === 200) {
          ElMessage({
            message: 'Quote edited successfully.',
            type: 'success'
          })
          emit('quoteEdited')
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

const setInitialData = () => {
  let quotePropJson = JSON.parse(JSON.stringify(quoteProp.quote))

  quoteData.value = {
    id: quotePropJson.id,
    authorId: quotePropJson.authorId,
    body: quotePropJson.body,
    bookReference: quotePropJson.bookReference,
    significant: quotePropJson.significant,
    userEmail: quotePropJson.userEmail
  }
}

const openDialog = () => {
  setInitialData()
}

onMounted(() => {
  fetchAuthors()
  setInitialData()
})
</script>
