
//import moment from 'moment/src/moment'

interface ListResult {
  list: Record<string, any>[]
  supplierList: Record<string, any>[]
  channelsList: Record<string, any>[]
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
  supplierList(state, res: ListResult) {

    state.supplierList = res.supplierList
    state.page = res.page
    state.limit = res.limit
    state.count = res.count
    state.loading = false
    //state.listUpdated = moment()
  },
  channelsList(state, res: ListResult) {

    state.channelsList = res.channelsList
    //state.listUpdated = moment()
  },
  skuData(state, res: any) {
    state.skuData = res.skuData
  },
  productAList(state, res: any) {
    state.productAList = res.productAList
  },
  productBList(state, res: any) {
    state.productBList = res.productBList
  },
  rewardsList(state, res: any) {
    state.rewardsList = res.rewardsList
  },
  searchResults(state, res: any) {
    state.searchResults = res.searchResults
  },

  loading(state, status = true) {
    state.loading = status
    this.dispatch('alert/clear', null, { root: true })
  }
}
