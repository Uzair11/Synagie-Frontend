import { pagination } from '~/shared/general'
export const defaultUser = { country: 'my', lang: 'en', race: '', identity: '' }
export const state = (): object => ({
  list: [],
  page: 1,
  limit: pagination.limit,
  record: defaultUser,
  loading: false,
  listUpdated: null,
  count : 0
})

export default state
