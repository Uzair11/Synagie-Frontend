import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

export default {

  async fetchMobileSettings({commit}): Promise<any> {
    let ref = firebase.firestore().collection('setting').doc('mobile')
    let snap = await ref.get()
    return snap.data() || {}
  },
  setTitle({ commit }, title: string) {
    commit('title', title)
  },
  toogleMenu({ commit, state }) {
    commit('toogleMenu')
  }
}
