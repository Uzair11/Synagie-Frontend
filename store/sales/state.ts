import { pagination } from '~/shared/general'
export const defaultUser = { country: 'my', lang: 'en', race: '', identity: '' }
export const state = (): object => ({
  list: [],
  completeSalesList: [] ,
  page: 1,
  limit: pagination.limit,
  record: defaultUser,
  loading: false,
  listUpdated: null,
  orderDetails :[],
  markCompleteStatus:null
})

export default state
