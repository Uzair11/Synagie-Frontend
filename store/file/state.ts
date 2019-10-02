import { pagination } from '~/shared/general'
export const defaultFile = {
  storageType: 'google',
  weight: 99,
  isPrivate: false
}
export const state = (): object => ({
  list: [],
  page: 1,
  limit: pagination.limit,
  record: defaultFile,
  loading: false,
  listUpdated: null
})

export default state
