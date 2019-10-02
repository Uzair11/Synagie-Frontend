/* eslint-disable member-delimiter-style */

//import moment from 'moment/src/moment'

interface ListResult {
  list: Record<string, any>[]
  completeSalesList: Record<string, any>[]
  page: number
  limit: number
  count: number
}

export default {
  updateField(state, res) {
    state.record[res.name] = res.value
    console.log('updated', state.record)
  },
  record(state, res) {
    state.record = res
    state.loading = false
  },
  listOnly(state, list) {
    state.list = list
    // state.listUpdated = moment()
  },
  list(state, res: ListResult) {
    state.list = res.list
    state.page = res.page
    state.limit = res.limit
    state.count = res.count
    state.loading = false
    //state.listUpdated = moment()
  },
  completeSalesList(state, res: ListResult) {

    state.completeSalesList = res.completeSalesList
    state.page = res.page
    state.limit = res.limit
    state.count = res.count
    state.loading = false
    //state.listUpdated = moment()
  },

  loading(state, status = true) {
    state.loading = status
    this.dispatch('alert/clear', null, { root: true })
  }
}
