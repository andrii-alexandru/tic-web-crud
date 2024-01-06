<template>
  <DefaultLayout>
    <div class="author-list-container">
      <el-card shadow="always" class="author-list-card">
        <el-row>
          <el-text size="large" tag="b" type="primary">ALL AUTHORS</el-text>
          <el-button
            type="primary"
            plain
            class="mx-10"
            circle
            @click="() => router.push('/create-author')"
            ><el-icon><Plus /></el-icon>
          </el-button>
        </el-row>
        <el-divider border-style="none"></el-divider>

        <el-table :data="filteredAuthors" style="width: 100%">
          <el-table-column label="Author Name" prop="name" sortable></el-table-column>
          <el-table-column label="Birth Date" prop="birthDate"></el-table-column>
          <el-table-column label="Nationality" prop="nationality"></el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
              <edit-author-dialog
                :author="scope.row"
                @authorEdited="fetchAuthors"
              ></edit-author-dialog>
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
            :total="authors.length"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFirebaseIdToken } from '@/components/utils/authUtils'
import axios from 'axios'
import EditAuthorDialog from '@/components/edit_author_dialog.vue'
import router from '@/router'
import { useStore } from 'vuex'

const authors = ref([])
const filteredAuthors = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const store = useStore()

const fetchAuthors = async () => {
  store.commit('setLoading', true)
  try {
    const db = getFirestore()
    const authorsCollection = collection(db, 'authors')
    const querySnapshot = await getDocs(authorsCollection)

    authors.value = querySnapshot.docs.map((doc) => {
      const { birthDate, ...otherData } = doc.data()

      const birthDateValid =
        birthDate && birthDate.toDate ? birthDate.toDate().getFullYear() : birthDate

      return {
        id: doc.id,
        birthDate: birthDateValid,
        ...otherData
      }
    })
    updateFilteredAuthors()
  } catch (error) {
    console.error('Error fetching authors: ', error)
  }
  store.commit('setLoading', false)
}

const updateFilteredAuthors = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  filteredAuthors.value = authors.value.slice(start, end)
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  updateFilteredAuthors()
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  updateFilteredAuthors()
}

const deleteQuote = async (authorId) => {
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

        await axios.delete(`http://localhost:3000/delete-author/${authorId}`, {
          headers: {
            Authorization: idToken
          }
        })

        ElMessage({
          type: 'success',
          message: 'Delete completed'
        })

        await fetchAuthors()
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

onMounted(() => {
  fetchAuthors()
})
</script>

<style scoped>
.author-list-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.author-list-container .author-list-card {
  width: 80vw;
  padding: 2rem;
}

@media screen and (max-width: 768px) {
  .author-list-container .author-list-card {
    width: 90vw;
    padding: 1rem;
  }
}
</style>
