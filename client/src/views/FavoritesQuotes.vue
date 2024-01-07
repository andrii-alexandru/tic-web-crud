<template>
  <default_layout>
    <el-row justify="center">
      <el-text size="large" tag="b" type="primary">FAVORITES</el-text>
    </el-row>
    <el-divider>
      <el-icon><StarFilled /></el-icon>
    </el-divider>
    <el-row justify="center" v-if="!userRef">
      <el-alert
        title="Not logged in"
        description="You have to log in in order to view favorite quotes."
        type="error"
        show-icon
      />
      <el-link class="mt-20" v-if="!userRef" type="danger" href="/login">
        go to login &nbsp; <el-icon><Right /></el-icon>
      </el-link>
    </el-row>
    <el-table v-if="userRef" :data="quotes" style="width: 100%" v-loading="loading" flexible="true">
      <el-table-column label="Author Name" prop="authorName" sortable width="150"></el-table-column>
      <el-table-column label="Quote Body" prop="body"></el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-popconfirm
            title="Remove from favorites?"
            width="250"
            confirm-button-type="danger"
            @confirm="removeFavoriteQuote(scope.row.id)"
          >
            <template #reference>
              <el-button link type="danger" size="small">Remove</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </default_layout>
</template>

<script setup>
import default_layout from '../components/default_layout.vue'
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { getFirebaseIdToken } from '@/components/utils/authUtils'
import axios from 'axios'
import { ElNotification } from 'element-plus'

const userRef = ref(null)
const quotes = ref([])
const loading = ref(true)

const fetchQuotes = async () => {
  try {
    const db = getFirestore()
    const sortedQuery = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(sortedQuery)

    quotes.value = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })

    //filter qutoes
    quotes.value = quotes.value.filter((quote) => {
      const userId = userRef.value?.uid || null

      if (Array.isArray(quote.favorite) && quote.favorite.length > 0) {
        return quote.favorite.includes(userId)
      }

      return false
    })

    loading.value = false
  } catch (error) {
    console.error('Error fetching quotes: ', error)
  }
}

const removeFavoriteQuote = async (quoteId) => {
  try {
    const idToken = await getFirebaseIdToken()
    if (idToken === null) return

    const response = await axios.put(
      `https://quotes.andrii.ro/api/update-favorite/${quoteId}`,
      {},
      {
        headers: {
          Authorization: idToken
        }
      }
    )

    if (response.data.error) throw new Error(response.data.error)

    ElNotification({
      title: 'Favorite removed',
      message: 'Removed from favorites.',
      position: 'bottom-right'
    })

    await fetchQuotes()
  } catch (error) {
    console.error('Error removing favorite quote: ', error)
  }
}

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    userRef.value = user
  })
  fetchQuotes()
})
</script>
