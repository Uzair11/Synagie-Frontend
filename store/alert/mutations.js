const mutations = {
  message(state, msg) {
    if (msg.length > 1 && msg[0] === '{' && msg[msg.length - 1] === '}') {
      let res = JSON.parse(msg)
      msg = res.message
    }
    state.message = msg
    state.updated_at = new Date()
  },
  message_type(state, t) {
    state.alert_type = t
  },

  link(state, e) {
    state.link = e.link
    state.linkLabel = e.linkLabel
  },
  clear(state) {
    state.alert_type = null
    state.message = null
    state.updated_at = null
  }
}

export default mutations
