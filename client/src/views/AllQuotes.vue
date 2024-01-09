<template>
  <DefaultLayout>
    <div class="quote-list-container">
      <el-card shadow="always" class="quote-list-card">
        <el-row>
          <el-text size="large" tag="b" type="primary">ALL QUOTES</el-text>
          <el-button
            type="primary"
            plain
            class="mx-10"
            circle
            @click="() => router.push('/create-quote')"
            ><el-icon><Plus /></el-icon>
          </el-button>
        </el-row>
        <el-divider border-style="none"></el-divider>

        <el-table :data="filteredQuotes" style="width: 100%">
          <el-table-column v-if="!!userRef">
            <template #header>
              <el-icon><Management /></el-icon>
            </template>
            <template #default="scope">
              <el-switch
                @change="updateFavorite(scope.row.id, scope.row.isFavorite)"
                v-model="scope.row.isFavorite"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66"
                active-text="❤️❤️"
              />
            </template>
          </el-table-column>
          <el-table-column label="Author" prop="author" sortable></el-table-column>
          <el-table-column label="Quote Body" prop="body" width="600"></el-table-column>
          <el-table-column label="Reference" prop="bookReference"></el-table-column>
          <el-table-column label="Significant" prop="significant">
            <template #default="scope">
              <el-tag v-if="scope.row.significant" type="success">Significant</el-tag>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="Operations">
            <template #default="scope">
              <edit-quote-dialog :quote="scope.row" @quote-edited="fetchQuotes"></edit-quote-dialog>
              <el-button link type="danger" size="small" @click="deleteQuote(scope.row.id)"
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
            :page-sizes="[5, 10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next"
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
import { getFirestore, doc, collection, getDocs, getDoc, query, orderBy } from 'firebase/firestore'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { getFirebaseIdToken } from '@/components/utils/authUtils'
import axios from 'axios'
import EditQuoteDialog from '../components/edit_quote_dialog.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import router from '@/router'
import { useStore } from 'vuex'

const quotes = ref([])
const filteredQuotes = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const store = useStore()

const fetchQuotes = async () => {
  store.commit('setLoading', true)
  try {
    const db = getFirestore()
    const sortedQuery = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(sortedQuery)

    quotes.value = await Promise.all(
      querySnapshot.docs.map(async (document) => {
        const quoteData = { id: document.id, ...document.data() }

        if (quoteData.author) {
          const authorId = quoteData.author

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

    quotes.value.map((quote) => {
      const userId = userRef.value?.uid || null
      quote.isFavorite = quote.favorite ? quote.favorite.includes(userId) : false
    })

    updateFilteredQuotes()
  } catch (error) {
    console.error('Error fetching quotes: ', error)
  }

  store.commit('setLoading', false)
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
  store.commit('setLoading', true)
  try {
    ElMessageBox.confirm('This will permanently delete the quote. Continue?', 'Error', {
      confirmButtonText: 'DELETE',
      cancelButtonText: 'Cancel',
      type: 'error'
    })
      .then(async () => {
        const idToken = await getFirebaseIdToken()
        if (idToken === null) return

        await axios.delete(`https://quotes.andrii.ro/api/delete-quote/${quoteId}`, {
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
  store.commit('setLoading', false)
}

const updateFavorite = async (quoteId, isFavorite) => {
  store.commit('setLoading', true)
  try {
    const idToken = await getFirebaseIdToken()
    if (idToken === null) return

    const response = await axios.put(
      `https://quotes.andrii.ro/api/update-favorite/${quoteId}`,
      { isFavorite },
      {
        headers: {
          Authorization: idToken
        }
      }
    )

    if (response.data.error) throw new Error(response.data.error)

    ElNotification({
      title: 'Favorite updated',
      message: isFavorite ? 'Added to favorites.' : 'Removed from favorites.',
      position: 'bottom-right'
    })
  } catch (error) {
    console.error('Error updating favorite: ', error)
  }
  store.commit('setLoading', false)
}

const userRef = ref(null)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    userRef.value = user
  })
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
