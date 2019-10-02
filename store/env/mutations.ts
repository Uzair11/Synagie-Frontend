export default {
  title(state, title: string) {
    state.title = title
  },
  setApiBaseURL(state, config = { baseURL: '', apiURL: '' }) {
    state.baseURL = config.baseURL
    state.apiURL = config.apiURL
  },
  toogleMenu(state) {
    state.sidebarCollapsed = !state.sidebarCollapsed
  }
  // async fetchCountries(state) {
  //   if (state.fetchingCountries) {
  //     return // is fetching
  //   }
  //   try {
  //     state.fetchingCountries = true
  //     const res = await this.$axios.$get('/js/country.json')

  //     state.countries = res
  //     state.fetchingCountries = false
  //   } catch (e) {
  //     commit('alert/error', e.message, { root: true })
  //     state.fetchingCountries = false
  //     throw e
  //   }
  // }
}
