export default {
  success({ commit, state }, message) {
    commit('message', message)
    commit('message_type', 'alert-success')
  },
  successWithOption({ commit, state }, e) {
    commit('message', e.message)
    commit('message_type', 'alert-success')
    commit('link', { link: e.link, linkLabel: e.linkLabel })
  },
  error({ commit, state }, message) {
    if (message && message.indexOf('GraphQL error:') === 0) {
      message = message.substring(15)
    }

    commit('message', message)
    commit('message_type', 'alert-danger')
  },
  errorWithOption({ commit, state }, e) {
    commit('message', e.message)
    commit('message_type', 'alert-danger')
    commit('link', { link: e.link, linkLabel: e.linkLabel })
  },
  clear({ commit, state }) {
    commit('clear')
  }
}
