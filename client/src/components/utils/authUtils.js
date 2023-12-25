import { ElMessage } from 'element-plus'
import { getAuth } from 'firebase/auth'

const auth = getAuth()
export const getFirebaseIdToken = async () => {
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
