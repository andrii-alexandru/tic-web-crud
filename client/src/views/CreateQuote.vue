<template>
  <DefaultLayout>
    <div class="quote-form-container">
      <el-card shadow="always" class="quote-form-card">
        <h2 class="title">Create New Quote</h2>
        <el-form
          ref="quoteForm"
          :model="quoteData"
          :rules="quoteRules"
          label-position="top"
          class="quote-form"
        >
          <el-form-item prop="author" label="Author" label-width="150px">
            <el-input
              v-model="quoteData.author"
              prefix-icon="User"
              placeholder="Author"
              size="large"
            ></el-input>
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
            <el-switch v-model="quoteData.significant" />
          </el-form-item>

          <el-row justify="center">
            <el-form-item>
              <el-button
                type="primary"
                class="create-button"
                @click="createQuote"
                size="large"
                round
                >Create Quote</el-button
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
import { useRouter } from 'vue-router'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth()

const router = useRouter()

const quoteData = ref({
  author: '',
  body: '',
  bookReference: '',
  significant: false
})

const quoteForm = ref(null)

const quoteRules = {
  author: [{ required: true, message: 'Please enter the author', trigger: 'blur' }],
  body: [{ required: true, message: 'Please enter the quote body', trigger: 'blur' }]
}

const createQuote = async () => {
  quoteForm.value.validate(async (valid) => {
    if (valid) {
      checkAuth()
      try {
        const db = getFirestore()
        const quotesCollection = collection(db, 'quotes')
        await addDoc(quotesCollection, quoteData.value)
        ElMessage({
          message: 'Quote created successfully.',
          type: 'success'
        })
        router.push('/quotes')
      } catch (error) {
        console.error('Error creating quote: ', error)
        ElMessage({
          type: 'error',
          message: 'Error creating the quote.'
        })
      }
    }
  })
}

const checkAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/login')
    }
  })
}
</script>

<style scoped>
.quote-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.quote-form-container .quote-form-card {
  width: 60vw;
  padding: 4rem;
}

@media screen and (max-width: 768px) {
  .quote-form-container .quote-form-card {
    width: 90vw;
    padding: 1rem;
  }
}
</style>
