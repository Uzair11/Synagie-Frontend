import { pagination } from '~/shared/general'
export const default<%=singularClassName %> = { }
export const state = () : object => ({
  list: [],
  page: 1,
  limit: pagination.limit,
  record: default<%=singularClassName %>,
  loading: false,
  listUpdated: null
})

export default state
