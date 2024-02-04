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
            ><el-icon>
              <Plus />
            </el-icon>
          </el-button>
        </el-row>
        <el-divider border-style="none"></el-divider>

        <el-table
          :data="filteredQuotes"
          style="width: 100%"
          empty-text="No quote registered yet... 😢"
        >
          <el-table-column v-if="!!userRef">
            <template #header>
              <el-icon>
                <Management />
              </el-icon>
            </template>
            <template #default="scope">
              <el-switch
                @change="updateFavorite(scope.row)"
                v-model="scope.row.isFavorite"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66"
                active-text="❤️❤️"
              />
            </template>
          </el-table-column>
          <el-table-column label="Author" prop="author.name" width="200" sortable></el-table-column>
          <el-table-column label="Quote" prop="body" width="400"></el-table-column>
          <el-table-column label="Ref." prop="bookReference" width="100"></el-table-column>
          <el-table-column label="Significant" prop="significant" width="150">
            <template #default="scope">
              <el-tag v-if="scope.row.significant" type="success">Significant</el-tag>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="Operations" width="100">
            <template #default="scope">
              <edit-quote-dialog :quote="scope.row" @quote-edited="fetchQuotes"></edit-quote-dialog>
              <el-button
                link
                type="danger"
                size="small"
                @click="deleteQuote(scope.row.id, scope.row.authorId)"
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
import { getFirestore, collection, getDocs } from 'firebase/firestore'
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
  quotes.value = []

  try {
    const db = getFirestore()

    const authorsSnapshot = await getDocs(collection(db, 'authors'))

    authorsSnapshot.forEach(async (authorDoc) => {
      const authorId = authorDoc.id

      const quotesCollection = collection(db, `authors/${authorId}/quotes`)
      const quotesSnapshot = await getDocs(quotesCollection)

      // Iterate through each quote document and push it to the quotes array
      quotesSnapshot.forEach((quoteDoc) => {
        quotes.value.push({
          id: quoteDoc.id,
          ...quoteDoc.data(),
          author: {
            ...authorDoc.data()
          },
          authorId,
          isFavorite: quoteDoc.data().favorite.includes(userRef.value.uid)
        })
      })

      quotes.value.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

      updateFilteredQuotes()
    })
  } catch (error) {
    console.error('Error fetching quotes: ', error)
    ElMessage({
      type: 'error',
      message: 'There was an error fetching the quotes.'
    })
  } finally {
    store.commit('setLoading', false)
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

const deleteQuote = async (quoteId, authorId) => {
  store.commit('setLoading', true)

  try {
    if (quoteId === undefined || authorId === undefined)
      throw new Error('quoteId and authorId are required')

    ElMessageBox.confirm('This will permanently delete the quote. Continue?', 'Error', {
      confirmButtonText: 'DELETE',
      cancelButtonText: 'Cancel',
      type: 'error'
    })
      .then(async () => {
        const idToken = await getFirebaseIdToken()
        if (idToken === null) return

        await axios.delete(`https://quotes.andrii.ro/api/delete-quote/${quoteId}/${authorId}`, {
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

const updateFavorite = async (row) => {
  store.commit('setLoading', true)

  try {
    const idToken = await getFirebaseIdToken()
    if (idToken === null) return

    const response = await axios.put(
      `https://quotes.andrii.ro/api/update-favorite`,
      {
        quoteId: row.id,
        authorId: row.authorId,
        isFavorite: row.isFavorite
      },
      {
        headers: {
          Authorization: idToken
        }
      }
    )

    if (response.data.error) throw new Error(response.data.error)

    ElNotification({
      title: 'Favorite updated',
      message: row.isFavorite ? 'Added to favorites.' : 'Removed from favorites.',
      position: 'bottom-right'
    })
  } catch (error) {
    console.error('Error updating favorite: ', error)
    row.isFavorite = !row.isFavorite
    ElMessage({
      type: 'error',
      message: 'There was an error updating favorite: ' + error.message
    })
  }
  store.commit('setLoading', false)
}

const userRef = ref(null)

onMounted(async () => {
  onAuthStateChanged(getAuth(), (user) => {
    userRef.value = user
  })

  await fetchQuotes()
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
