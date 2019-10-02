/* eslint-disable no-undef, member-delimiter-style */

import {
  pagination,
  parseFormForServer,
  cacheDuration,
  region
} from '~/shared/general'
import { loadImageWithCache } from '~/shared/image'
import { ObjectId } from 'bson'
import { defaultUser } from './state'
import { StandardError } from '~/errors/base'
import { differences } from '~/shared/diff'
//import moment from 'moment/src/moment'
import { encode as firebaseKeyEncode } from 'firebase-key-encode'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

interface SortParam {
  field: string
  dir: string
}

interface ListParam {
  page?: number
  limit?: number
  sorts?: SortParam[]
  filters: Record<string, any>
  startAfter?: any
  force?: boolean,
  sortField: any,
  sortOrder: any
}

interface UpdateParam {
  name: string
  value: [string, number, object]
}

interface UploadParam {
  field: string
  name: string
  file: Record<string, any>
  userId: string
}

interface UploadResult {
  path: string
  url: string
}

interface UserParam {
  _id?: string
  first_name: string
  last_name: string
  displayName: string
  user_role: string
  photo: string
  photoURL: string
  mobile: string
  createdAt: Date
  updatedAt: Date
  email: string
  status: number
  race: string
  lang: string
  country: string
}

function checkForm(u: UserParam): boolean {
  let required = [
    'firstName',
    'lastName'
    // 'displayName',
    // 'photoURL',
    // 'mobile',
    // 'email',
    // 'status',
    // 'race',
    // 'lang',
    // 'country'
  ]
  if (!u._id) {
    // required += ['memType']
  }
  for (let i in required) {
    const field = required[i]
    // console.log(field)
    if (u[field] === undefined) {
      throw Error(field + ' is required')
    }
  }

  return true
}

export default {

  async saveUser({ commit, dispatch, rootState, state }, u: UserParam) {
    //checkForm(u)
    commit('loading')

    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let res =  await this.$axios.post(process.env.apiBaseUrl + '/register', u, config)




    commit('loading', false)
    return u
  },
  async updateUserPassword({ commit, dispatch, rootState, state }, u: any) {
    //checkForm(u)
    commit('loading')

    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let res =  await this.$axios.put(process.env.apiBaseUrl + '/password', u, config)
    commit('loading', false)
    return u
  },

  async loadChilds({ commit, state }) {
    let res: any[] = []
    for (let p in state.list) {
      const user = Object.assign({}, state.list[p])

      await loadImageWithCache(
        user,
        user._id,
        'user/' + user._id + '/photo',
        'photo'
      )
      res.push(user)
    }
    commit('listOnly', res)
  },

  async fetchUserList({ commit, dispatch, rootState, state }, p: ListParam) {
    console.log('fetching user', p)
    if (!p.force && state.listUpdated) {
      const diff = state.listUpdated
      console.log('diff', diff, diff.asSeconds())
      if (diff.asSeconds() <= cacheDuration) {
        return
      }
    }

    commit('loading')

    const limit = p.limit ? p.limit : pagination.limit
    const page = p.page || 1
    const offset = (page - 1) * limit
    let sortType = p.sortOrder == 'descend' ? 'desc' : 'asc'
    let sortField = p.sortField != undefined ? p.sortField : 'created_datetime'
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let res =  await this.$axios.get(process.env.apiBaseUrl + '/users?page=' + page + '&size=' +
      p.limit + '&coloumn_sort=' + sortField + '&sort_type=' + sortType, config)

    // console.log('res', res)
    let list: any[] = []
    for (let c = 0; c < res.data.users.length; c++) {
      let child = res.data.users[c]
      let row = Object.assign({ _id: child.user_id }, child._source)
      row = await dispatch('loadUser', row)
      // console.log('list row', row)
      list.push(row)
    }

    console.log('result', list)
    commit('list', {
      list: res.data.users,
      page: 1,
      limit: 100,
      count: res.data.totalCount
    })
    // dispatch('loadChilds')
    return list
  },


  async loadUser({ commit, rootState }, res) {
    // console.log('loadOrder', res)
    // res._id = new ObjectId(res._id)
    let currentUser = rootState.session.currentUser
    if (res.user_id === currentUser.uid) {
      res.user = currentUser
      res.userName = currentUser.firstName + ' ' + currentUser.lastName
    }

    for (let field in res) {
      if (field.endsWith('_at') || field.endsWith('At')) {
        if (res[field] && res[field].toDate) {
          // console.log('loading offer', field, res[field])
          res[field] = (res[field].toDate()) // firebase - fetch single
        } else if (res[field]) {
          res[field] = (res[field]) // mongodb
        }
      }
    }
    // if (res.thumbnail) {
    //   res.thumbnailURL =
    //     serverURL +
    //     '/user/' +
    //     id +
    //     '/thumbnail?r=' +
    //     Math.floor(Math.random() * 1000000 + 1)
    // }

    return res
  },

  setUserField({ commit, dispatch, state }, p: UpdateParam) {
    commit('updateField', p)
  },

  loading({ commit }, status?: boolean) {
    commit('loading', status)
  }
}
