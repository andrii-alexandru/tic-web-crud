import { ElMessage } from 'element-plus'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth'

export const getFirebaseIdToken = async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    return await user.getIdToken()
  } else {
    ElMessage({
      type: 'error',
      dangerouslyUseHTMLString: true, // Allow HTML in the message
      message: 'You must be <a href="/login">logged in</a> to perform this action',
      showClose: true
    })
    return null
  }
}

export const signIn = async (email, password) => {
  const auth = getAuth()
  try {
    await signInWithEmailAndPassword(auth, email, password)
    ElMessage({
      type: 'success',
      message: 'You have successfully logged in',
      showClose: true
    })
    return true
  } catch (error) {
    return handleError(error)
  }
}

export const signOutUser = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    ElMessage('You have successfully logged out')
  } catch (error) {
    handleError(error)
  }
}

export const register = async (email, password) => {
  const auth = getAuth()
  try {
    await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    handleError(error)
  }
}

function handleError(error) {
  ElMessage({
    type: 'error',
    message: error.message,
    showClose: true
  })

  return false
}
