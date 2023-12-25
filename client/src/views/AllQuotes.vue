<template>
  <DefaultLayout>
    <div class="quote-list-container">
      <el-card shadow="always" class="quote-list-card">
        <h2 class="title">All Quotes</h2>
        <el-table :data="filteredQuotes" style="width: 100%" v-loading="loading">
          <el-table-column label="Author" prop="author" sortable></el-table-column>
          <el-table-column label="Quote Body" prop="body"></el-table-column>
          <el-table-column label="Book or Reference" prop="bookReference"></el-table-column>
          <el-table-column label="Significant" prop="significant">
            <template #default="scope">
              <el-tag v-if="scope.row.significant" type="success">Significant</el-tag>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
              <edit-quote-dialog :quote="scope.row" @quote-edited="fetchQuotes"></edit-quote-dialog>
              <el-button link type="primary" size="small" @click="deleteQuote(scope.row.id)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row justify="center" class="mt-20">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            @size-change="handlePageSizeChange"
            :page-size="pageSize"
            :page-sizes="[3, 10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="quotes.length"
          />
        </el-row>
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '../components/default_layout.vue'
import { getFirestore, doc, collection, getDocs, getDoc } from 'firebase/firestore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFirebaseIdToken } from '../components/utils/authUtils.js'
import axios from 'axios'
import EditQuoteDialog from '../components/EditQuoteDialog.vue'

const quotes = ref([])
const filteredQuotes = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(3) // Set to 3 to display 3 quotes per page

const fetchQuotes = async () => {
  try {
    const db = getFirestore()
    const querySnapshot = await getDocs(collection(db, 'quotes'))

    quotes.value = await Promise.all(
      querySnapshot.docs.map(async (document) => {
        const quoteData = { id: document.id, ...document.data() }

        if (quoteData.author) {
          const authorId = quoteData.author
          console.log('authorId: ', authorId)

          const authorRef = doc(db, 'authors', authorId)
          const authorDoc = await getDoc(authorRef)

          if (authorDoc.exists()) {
            quoteData.author = authorDoc.data().name
          } else {
            quoteData.author = 'Unknown'
          }
        }

        return quoteData
      })
    )

    loading.value = false
    updateFilteredQuotes()
  } catch (error) {
    console.error('Error fetching quotes: ', error)
  }
}

const updateFilteredQuotes = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  filteredQuotes.value = quotes.value.slice(start, end)
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  updateFilteredQuotes()
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  updateFilteredQuotes()
}

const deleteQuote = async (quoteId) => {
  try {
    ElMessageBox.confirm('This will permanently delete the quote. Continue?', 'Error', {
      confirmButtonText: 'DELETE',
      cancelButtonText: 'Cancel',
      type: 'error'
    })
      .then(async () => {
        const idToken = await getFirebaseIdToken()
        if (idToken === null) return

        await axios.delete(`http://localhost:3000/delete-quote/${quoteId}`, {
          headers: {
            Authorization: idToken
          }
        })

        ElMessage({
          type: 'success',
          message: 'Delete completed'
        })

        await fetchQuotes()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled'
        })
      })
  } catch (error) {
    console.error('Error deleting quote: ', error)
  }
}

onMounted(() => {
  fetchQuotes()
})
</script>

<style scoped>
.quote-list-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.quote-list-container .quote-list-card {
  width: 80vw;
  padding: 2rem;
}

@media screen and (max-width: 768px) {
  .quote-list-container .quote-list-card {
    width: 90vw;
    padding: 1rem;
  }
}
</style>
