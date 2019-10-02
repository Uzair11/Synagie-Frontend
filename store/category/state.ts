import { pagination } from '~/shared/general'
export const defaultCategory = { status: 1 }
export const state = (): object => ({
  list: [],
  page: 1,
  limit: pagination.limit,
  record: defaultCategory,
  loading: false,
  listUpdated: null
})

export default state
