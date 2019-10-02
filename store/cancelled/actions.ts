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
  url: string,
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



export default {

  async fetchList({ commit, dispatch, rootState, state }, p: ListParam) {

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
    let sortField = p.sortField != undefined ? p.sortField : 'order_id'
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    console.log(process.env.apiBaseUrl + p.url + '?page=' + page);
    let res = await this.$axios.get(process.env.apiBaseUrl + p.url + '?page=' + page + '&size=' +
      p.limit + '&coloumn_sort=' + sortField + '&sort_type=' + sortType, config)

    // console.log('res', res)
    let list: any[] = []
    res.data.sales.forEach(element => {
      element.channel = element.channel ? element.channel.name : ''

      if (element.items) {
        if (element.items.length > 0) {
          element.quantity = element.items[0].quantity
          element.sku = element.items[0].sku
        }
      }
      list.push(element);
    });

    console.log('result', list)
    commit('list', {
      list: list,
      page: 1,
      limit: 100,
      count: res.data.totalCount
    })
    // dispatch('loadChilds')
    return list
  },


  loading({ commit }, status?: boolean) {
    commit('loading', status)
  }
}
