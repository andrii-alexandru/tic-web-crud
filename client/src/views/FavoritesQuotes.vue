<template>
  <default_layout>
    <el-row justify="center">
      <el-text size="large" tag="b" type="primary">FAVORITES</el-text>
    </el-row>
    <el-divider>
      <el-icon>
        <StarFilled />
      </el-icon>
    </el-divider>
    <el-row justify="center" v-if="!userRef">
      <el-alert
        title="Not logged in"
        description="You have to log in in order to view favorite quotes."
        type="error"
        show-icon
      />
      <el-link class="mt-20" v-if="!userRef" type="danger" href="/login">
        go to login &nbsp;
        <el-icon>
          <Right />
        </el-icon>
      </el-link>
    </el-row>
    <el-table
      v-if="userRef"
      :data="quotes"
      style="width: 100%"
      :flexible="true"
      empty-text="Go on and save the world!"
    >
      <el-table-column
        label="Author Name"
        prop="author.name"
        sortable
        width="150"
      ></el-table-column>
      <el-table-column label="Quote Body" prop="body"></el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-popconfirm
            title="Remove from favorites?"
            width="250"
            confirm-button-type="danger"
            @confirm="removeFavoriteQuote(scope.row)"
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
import { useStore } from 'vuex'

const userRef = ref(null)
const quotes = ref([])
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
        if (quoteDoc.data().favorite.includes(userRef.value.uid)) {
          quotes.value.push({
            id: quoteDoc.id,
            ...quoteDoc.data(),
            author: {
              ...authorDoc.data()
            },
            authorId
          })
        }
      })
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

const removeFavoriteQuote = async (row) => {
  store.commit('setLoading', true)
  try {
    const idToken = await getFirebaseIdToken()
    if (idToken === null) return

    const response = await axios.put(
      `http://localhost:3000/api/update-favorite`,
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
      title: 'Favorite removed',
      message: 'Removed from favorites.',
      position: 'bottom-right'
    })

    await fetchQuotes()
  } catch (error) {
    console.error('Error removing favorite quote: ', error)
  } finally {
    store.commit('setLoading', false)
  }
}

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    userRef.value = user
  })
  fetchQuotes()
})
</script>
