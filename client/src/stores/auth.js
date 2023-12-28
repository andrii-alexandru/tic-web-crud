import { createStore } from 'vuex'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

export const authStore = createStore({
  // State
  state: () => ({
    user: null,
    error: null
  }),

  // Getters
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    authError: (state) => state.error
  },

  // Actions
  actions: {
    async register({ commit }, { email, password }) {
      const auth = getAuth()

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        commit('setUser', user)
      } catch (error) {
        commit('setError', error.message)
      }
    },

    async signIn({ commit }, { email, password }) {
      const auth = getAuth()

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        commit('setUser', user)
      } catch (error) {
        commit('setError', error.message)
      }
    },

    async signOut({ commit }) {
      const auth = getAuth()

      try {
        await signOut(auth)
        commit('setUser', null)
      } catch (error) {
        commit('setError', error.message)
      }
    }
  },

  // Mutations
  mutations: {
    setUser: (state, user) => {
      state.user = user
      state.error = null
    },

    setError: (state, error) => {
      state.error = error
      state.user = null
    }
  }
})
