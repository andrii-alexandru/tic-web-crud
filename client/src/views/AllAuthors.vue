<template>
  <DefaultLayout>
    <div class="author-list-container">
      <el-card shadow="always" class="author-list-card">
        <h2 class="title">All Authors</h2>
        <el-table :data="filteredAuthors" style="width: 100%" v-loading="loading">
          <el-table-column label="Author Name" prop="name" sortable></el-table-column>
          <el-table-column label="Birth Date" prop="birthDate"></el-table-column>
          <el-table-column label="Nationality" prop="nationality"></el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
              <!--              <el-button link type="primary" size="small">Edit</el-button>-->
              <edit-author-dialog
                :author="scope.row"
                @authorEdited="fetchAuthors"
              ></edit-author-dialog>
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
import { getFirebaseIdToken } from '../components/utils/authUtils.js'
import axios from 'axios'
import EditAuthorDialog from '@/components/EditAuthorDialog.vue'

const authors = ref([])
const filteredAuthors = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(3) // Set to 3 to display 3 authors per page

const fetchAuthors = async () => {
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
    loading.value = false
    updateFilteredAuthors()
  } catch (error) {
    console.error('Error fetching authors: ', error)
  }
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
