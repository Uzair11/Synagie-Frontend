const mutations = {
  loading(state, status = true) {
    state.loading = status
  },
  load(state, settings) {
    state.loaded = true
    state.settings = settings
    state.loading = false
  },
  success(state, res) {
    // console.log('success login', res)
    state.currentUser = res
  },
  fail(state, message) {
    // console.log("failed", this)
    state.loading = false
    state.message = message
  },

  logout(state) {
    console.log('logout!')
    state.currentUser = null
    state.loading = false
    localStorage.clear();
  }
}

export default mutations
