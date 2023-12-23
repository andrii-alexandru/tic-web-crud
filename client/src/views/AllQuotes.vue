<template>
  <DefaultLayout>
    <div class="quote-list-container">
      <el-card shadow="always" class="quote-list-card">
        <h2 class="title">All Quotes</h2>
        <el-table :data="quotes" style="width: 100%" v-loading="loading">
          <el-table-column label="Author" prop="author"></el-table-column>
          <el-table-column label="Quote Body" prop="body"></el-table-column>
          <el-table-column label="Book or Reference" prop="bookReference"></el-table-column>
          <el-table-column label="Significant" prop="significant"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '../components/default_layout.vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const quotes = ref([])
const loading = ref(true)

const fetchQuotes = async () => {
  try {
    const db = getFirestore()
    const quotesCollection = collection(db, 'quotes')
    const querySnapshot = await getDocs(quotesCollection)

    quotes.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    loading.value = false
  } catch (error) {
    console.error('Error fetching quotes: ', error)
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
