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
          <el-form-item prop="author" label="Author">
            <el-select v-model="quoteData.author" placeholder="Select Author" size="large">
              <el-option
                v-for="author in authors"
                :key="author.id"
                :label="author.name"
                :value="author.id"
              ></el-option>
            </el-select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <add-author-dialog
              v-if="authors.length > 0"
              :quoteData="quoteData"
              :authors="authors"
              :fetchAuthors="fetchAuthors"
              @authorAdded="
                () => {
                  fetchAuthors()
                }
              "
            />
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
            <el-col :span="12">
              <el-input
                v-model="quoteData.bookReference"
                placeholder="Book or Reference"
                size="large"
              ></el-input>
            </el-col>
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
import { ref, onMounted } from 'vue'
import DefaultLayout from '../components/default_layout.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getFirebaseIdToken } from '../components/utils/authUtils.js'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import axios from 'axios'
import AddAuthorDialog from '../components/add_author_dialog.vue'

const router = useRouter()

const quoteData = ref({
  author: '', // Now it stores the ID of the selected author
  body: '',
  bookReference: '',
  significant: false,
  favorite: []
})

const authors = ref([])
const quoteForm = ref(null)

const quoteRules = {
  author: [{ required: true, message: 'Please select the author', trigger: 'blur' }],
  body: [{ required: true, message: 'Please enter the quote body', trigger: 'blur' }]
}

const createQuote = async () => {
  quoteForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const idToken = await getFirebaseIdToken()
        if (idToken === null) return

        const response = await axios.post('http://localhost:3000/create-quote', quoteData.value, {
          headers: {
            Authorization: idToken
          }
        })

        if (response.status === 200) {
          ElMessage({
            message: 'Quote created successfully.',
            type: 'success'
          })
          router.push('/quotes')
        } else {
          console.error('Error creating quote: ', response.data)
          ElMessage({
            type: 'error',
            message: 'Error creating the quote.'
          })
        }
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

// Fetch authors from Firestore
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

// Fetch authors on component mount
onMounted(() => {
  fetchAuthors()
})
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
