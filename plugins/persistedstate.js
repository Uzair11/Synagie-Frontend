import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

export default ({ store, isHMR, app }) => {
  if (isHMR) return

  // console.log('create persisted')
  createPersistedState({
    key: 'vuex',
    paths: ['session'],
    storage: {
      getItem: key => Cookies.get(key),
      setItem: (key, value) => Cookies.set(key, value, { expires: 3 }),
      removeItem: key => Cookies.remove(key)
    }
  })(store)
}
