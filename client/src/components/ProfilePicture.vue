<template>
  <div>
    <el-upload
      action="#"
      :show-file-list="false"
      :before-upload="beforeUpload"
      v-if="!profilePictureUrl"
    >
      <el-button type="text">upload profile picture</el-button>
    </el-upload>

    <template v-else>
      <el-row justify="center">
        <el-col>
          <el-avatar :src="profilePictureUrl" shape="circle" :size="100"></el-avatar>
        </el-col>
        <el-col>
          <el-button v-if="profilePictureUrl" @click="removeProfilePicture" type="danger" link
            >Remove Profile Picture</el-button
          >
        </el-col>
      </el-row>
    </template>
    <el-divider></el-divider>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
  deleteObject
} from 'firebase/storage'

const auth = getAuth()
const storage = getStorage()

const userId = ref(null)
const profilePictureUrl = ref(null)

// Function to get the user's profile picture URL
const getProfilePictureUrl = async (userId) => {
  try {
    const storageFileRef = storageRef(storage, `profilePictures/${userId}/profilePicture.jpg`)
    const url = await getDownloadURL(storageFileRef)
    console.log('URL:', url)
    profilePictureUrl.value = url
    console.log('Profile picture URL:', profilePictureUrl)
  } catch (error) {
    // Don't log the error; let the component handle it
    console.error('Error getting profile picture URL:', error)
    profilePictureUrl.value = null
  }
}

// Function to handle file upload
const beforeUpload = async (file) => {
  try {
    const storageFileRef = storageRef(storage, `profilePictures/${userId.value}/profilePicture.jpg`)
    await uploadBytes(storageFileRef, file)
    getProfilePictureUrl(userId.value)
  } catch (error) {
    console.error('Error uploading profile picture:', error)
  }

  // Prevent automatic upload by returning false
  return false
}

// Function to remove the user's profile picture
const removeProfilePicture = async () => {
  try {
    const storageFileRef = storageRef(storage, `profilePictures/${userId.value}/profilePicture.jpg`)
    await deleteObject(storageFileRef)
    profilePictureUrl.value = ''
  } catch (error) {
    console.error('Error removing profile picture:', error)
  }
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
