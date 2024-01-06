<template>
  <div>
    <el-upload
      action="#"
      :show-file-list="false"
      :before-upload="beforeUpload"
      v-if="!profilePictureUrl"
    >
      <el-button link>
        <el-icon size="large"><Picture /></el-icon>
        &nbsp; upload profile picture
      </el-button>
    </el-upload>

    <template v-else>
      <el-row justify="center">
        <el-col>
          <el-avatar :src="profilePictureUrl" shape="circle" :size="100"></el-avatar>
        </el-col>
        <el-col>
          <el-popconfirm
            title="Are you sure to delete this?"
            confirmButtonText="Remove"
            cancel-button-text="No, Thanks"
            width="220"
            hide-icon
            @confirm="removeProfilePicture"
          >
            <template #reference>
              <el-link v-if="profilePictureUrl" type="danger">Remove Profile Picture</el-link>
            </template>
          </el-popconfirm>
        </el-col>
      </el-row>
    </template>
    <el-divider></el-divider>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes
} from 'firebase/storage'
import { ElNotification } from 'element-plus'
import { useStore } from 'vuex'

const auth = getAuth()
const storage = getStorage()

const userId = ref(null)
const profilePictureUrl = ref(null)

const store = useStore()

// Function to get the user's profile picture URL
const getProfilePictureUrl = async (userId) => {
  store.commit('setLoading', true)
  try {
    const storageFileRef = storageRef(storage, `profilePictures/${userId}/profilePicture.jpg`)
    profilePictureUrl.value = await getDownloadURL(storageFileRef)
  } catch (error) {
    profilePictureUrl.value = null
  }
  store.commit('setLoading', false)
}

// Function to handle file upload
const beforeUpload = async (file) => {
  store.commit('setLoading', true)

  //check if file is jpn or png
  const validImageTypes = ['image/jpeg', 'image/png']
  if (!validImageTypes.includes(file.type)) {
    ElNotification({
      title: 'Error',
      message: 'Only JPG and PNG files are allowed',
      type: 'error'
    })
    return false
  }

  try {
    const storageFileRef = storageRef(storage, `profilePictures/${userId.value}/profilePicture.jpg`)
    await uploadBytes(storageFileRef, file)
    await getProfilePictureUrl(userId.value)
  } catch (error) {
    console.error('Error uploading profile picture:', error)
  }

  store.commit('setLoading', false)
  return false
}

// Function to remove the user's profile picture
const removeProfilePicture = async () => {
  store.commit('setLoading', true)
  try {
    const storageFileRef = storageRef(storage, `profilePictures/${userId.value}/profilePicture.jpg`)
    await deleteObject(storageFileRef)
    profilePictureUrl.value = ''
  } catch (error) {
    console.error('Error removing profile picture:', error)
  }
  store.commit('setLoading', false)
}

onMounted(() => {
  // Set the user ID when authenticated
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid
      getProfilePictureUrl(userId.value)
    }
  })
})
</script>
