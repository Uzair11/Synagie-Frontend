import { pagination } from '~/shared/general'
export const defaultUser = { country: 'my', lang: 'en', race: '', identity: '' }
export const state = (): object => ({
  list: [],
  supplierList: [],
  completeSalesList: [],
  channelsList: [],
  skuData: [],
  productAList: [],
  productBList: [],
  rewardsList: [],
  searchResults: [],
  page: 1,
  limit: pagination.limit,
  record: defaultUser,
  loading: false,
  listUpdated: null
})

export default state
