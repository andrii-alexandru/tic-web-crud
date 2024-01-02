import { createStore } from 'vuex'

export const loadingStore = createStore({
  state: () => ({
    loading: false
  }),

  getters: {
    isLoading: (state) => state.loading
  },

  actions: {
    setLoading({ commit }, value) {
      commit('setLoading', value)
    }
  },

  mutations: {
    setLoading(state, value) {
      state.loading = value
    }
  }
})
