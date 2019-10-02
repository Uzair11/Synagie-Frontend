
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

interface LoginParam {
  username: string
  password: string
}

export default {

  async login({ commit, dispatch, rootState }, p: LoginParam) {
    const config = {
      headers: { 'content-type': 'application/json' }
    }
    console.log("login", p)
    const result = await this.$axios.post(process.env.apiBaseUrl + '/login', {
      email: p.username,
      password: p.password
    }, config)
    console.log(result)
    localStorage.setItem("token", result.data.token);
    let currentUser = {
      uid: "res.user.uid",
      email: p.username,
      isAdmin: result.data.is_superuser,
      role: result.data.role,
      token: result.data.token,
      displayName: "res.user.displayName",
      phoneNumber: "res.user.phoneNumber",
      photoURL: "res.user.photoURL"
    }
    // fire.currentUser
    // console.log('currentUser', currentUser)
    commit('success', currentUser)
    return currentUser
  },

  async logout({ commit, dispatch, rootState }) {

    commit('logout')
    this.$router.push("/");
  },
  async emptyState({ commit, dispatch, rootState }) {

    commit('logout')
  }
}
