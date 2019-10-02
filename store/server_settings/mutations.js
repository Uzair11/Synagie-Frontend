const mutations = {
  loading(state, status = true) {
    state.loading = status
  },
  load(state, settings) {
    state.loaded = true
    state.settings = settings
    state.loading = false
  },
  success(state) {
    this.dispatch('alert/success', 'form.saved')
    state.loading = false
  },
  formErrors(state, errors) {
    if (errors.length === 0) {
      state.errors = []
      return
    }

    let res = {}
    for (let k in errors) {
      let err = errors[k]
      // console.log("err", err)
      res[err.name] = err.errors
    }
    state.errors = res
  },
  fail(state, message) {
    // console.log("failed", this)
    state.loading = false
    state.message = message
    this.dispatch('alert/error', message)
  }
}

export default mutations
